#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to handle errors and perform rollback
handle_error() {
    echo "Error occurred during deployment. Rolling back..."
    # Add rollback steps here
    exit 1
}

# Set up error handling
trap 'handle_error' ERR

# Load environment variables
if [ -f .env.$ENVIRONMENT ]; then
    source .env.$ENVIRONMENT
else
    echo "Environment file .env.$ENVIRONMENT not found. Exiting."
    exit 1
fi

echo "Deploying Swan-Z Style App to $ENVIRONMENT environment..."

# Tag the release
RELEASE_TAG="release-$(date +%Y%m%d-%H%M%S)"
git tag $RELEASE_TAG
git push origin $RELEASE_TAG

# Build the application
echo "Building the application..."
./scripts/build.sh

# Start blue-green deployment
echo "Starting blue-green deployment..."
NEW_TASK_DEF=$(aws ecs describe-task-definition --task-definition $ECS_TASK_FAMILY --region $AWS_REGION | jq '.taskDefinition | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities)')
NEW_TASK_DEF=$(echo $NEW_TASK_DEF | jq '.containerDefinitions[0].image="'${ECR_REGISTRY}/${ECR_REPOSITORY}:${RELEASE_TAG}'"')
NEW_TASK_DEF_ARN=$(aws ecs register-task-definition --region $AWS_REGION --cli-input-json "$NEW_TASK_DEF" | jq -r '.taskDefinition.taskDefinitionArn')

aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --task-definition $NEW_TASK_DEF_ARN --region $AWS_REGION

# Wait for deployment to complete
echo "Waiting for deployment to complete..."
aws ecs wait services-stable --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION

# Update database schema
echo "Updating database schema..."
npm run db:migrate

# Clear cache
echo "Clearing application cache..."
aws elasticache modify-cache-cluster --cache-cluster-id $REDIS_CLUSTER_ID --apply-immediately --region $AWS_REGION

# Run post-deployment tests
echo "Running post-deployment tests..."
npm run test:e2e

# Validate deployment
echo "Validating deployment..."
HEALTH_CHECK_URL="https://api.swanzstyle.com/health"
if curl -sSf $HEALTH_CHECK_URL > /dev/null; then
    echo "Deployment validated successfully."
else
    echo "Deployment validation failed. Rolling back..."
    # Add rollback steps here
    exit 1
fi

# Update CDN cache
echo "Invalidating CDN cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --region $AWS_REGION

# Deploy mobile app
echo "Deploying mobile app..."
./scripts/deploy_mobile.sh

# Send notification
echo "Sending deployment notification..."
curl -X POST -H 'Content-type: application/json' --data '{"text":"Swan-Z Style App has been successfully deployed to '"$ENVIRONMENT"' environment."}' $SLACK_WEBHOOK_URL

echo "Deployment completed successfully!"

# Update monitoring and logging
echo "Updating monitoring and logging configurations..."
./scripts/update_monitoring.sh

echo "Deployment process finished."