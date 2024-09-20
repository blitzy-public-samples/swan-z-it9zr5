import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
import base64
from src.shared.constants.index import StyleLines

class DesignGeneratorModel:
    def __init__(self, latent_dim, num_classes):
        self.latent_dim = latent_dim
        self.num_classes = num_classes
        self.generator = self.build_generator()
        self.discriminator = self.build_discriminator()

    def build_generator(self):
        noise_input = tf.keras.layers.Input(shape=(self.latent_dim,))
        label_input = tf.keras.layers.Input(shape=(1,), dtype='int32')
        
        label_embedding = tf.keras.layers.Embedding(self.num_classes, 50)(label_input)
        label_embedding = tf.keras.layers.Flatten()(label_embedding)
        
        x = tf.keras.layers.Concatenate()([noise_input, label_embedding])
        
        x = tf.keras.layers.Dense(7*7*256, use_bias=False)(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.LeakyReLU()(x)
        
        x = tf.keras.layers.Reshape((7, 7, 256))(x)
        
        x = tf.keras.layers.Conv2DTranspose(128, (5, 5), strides=(1, 1), padding='same', use_bias=False)(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.LeakyReLU()(x)
        
        x = tf.keras.layers.Conv2DTranspose(64, (5, 5), strides=(2, 2), padding='same', use_bias=False)(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.LeakyReLU()(x)
        
        x = tf.keras.layers.Conv2DTranspose(3, (5, 5), strides=(2, 2), padding='same', use_bias=False, activation='tanh')(x)
        
        model = tf.keras.Model([noise_input, label_input], x)
        return model

    def build_discriminator(self):
        img_input = tf.keras.layers.Input(shape=(28, 28, 3))
        label_input = tf.keras.layers.Input(shape=(1,), dtype='int32')
        
        label_embedding = tf.keras.layers.Embedding(self.num_classes, 50)(label_input)
        label_embedding = tf.keras.layers.Flatten()(label_embedding)
        label_embedding = tf.keras.layers.Dense(28*28)(label_embedding)
        label_embedding = tf.keras.layers.Reshape((28, 28, 1))(label_embedding)
        
        x = tf.keras.layers.Concatenate()([img_input, label_embedding])
        
        x = tf.keras.layers.Conv2D(64, (5, 5), strides=(2, 2), padding='same')(x)
        x = tf.keras.layers.LeakyReLU()(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        
        x = tf.keras.layers.Conv2D(128, (5, 5), strides=(2, 2), padding='same')(x)
        x = tf.keras.layers.LeakyReLU()(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        
        x = tf.keras.layers.Flatten()(x)
        x = tf.keras.layers.Dense(1, activation='sigmoid')(x)
        
        model = tf.keras.Model([img_input, label_input], x)
        return model

    def train(self, design_data, labels, epochs, batch_size):
        cross_entropy = tf.keras.losses.BinaryCrossentropy(from_logits=True)
        generator_optimizer = tf.keras.optimizers.Adam(1e-4)
        discriminator_optimizer = tf.keras.optimizers.Adam(1e-4)
        
        @tf.function
        def train_step(images, labels):
            noise = tf.random.normal([batch_size, self.latent_dim])
            
            with tf.GradientTape() as gen_tape, tf.GradientTape() as disc_tape:
                generated_images = self.generator([noise, labels], training=True)
                
                real_output = self.discriminator([images, labels], training=True)
                fake_output = self.discriminator([generated_images, labels], training=True)
                
                gen_loss = cross_entropy(tf.ones_like(fake_output), fake_output)
                disc_loss = cross_entropy(tf.ones_like(real_output), real_output) + \
                            cross_entropy(tf.zeros_like(fake_output), fake_output)
            
            gradients_of_generator = gen_tape.gradient(gen_loss, self.generator.trainable_variables)
            gradients_of_discriminator = disc_tape.gradient(disc_loss, self.discriminator.trainable_variables)
            
            generator_optimizer.apply_gradients(zip(gradients_of_generator, self.generator.trainable_variables))
            discriminator_optimizer.apply_gradients(zip(gradients_of_discriminator, self.discriminator.trainable_variables))
            
            return gen_loss, disc_loss
        
        history = {'gen_loss': [], 'disc_loss': []}
        
        for epoch in range(epochs):
            for batch_images, batch_labels in tf.data.Dataset.from_tensor_slices((design_data, labels)).shuffle(len(design_data)).batch(batch_size):
                gen_loss, disc_loss = train_step(batch_images, batch_labels)
                history['gen_loss'].append(gen_loss.numpy())
                history['disc_loss'].append(disc_loss.numpy())
            
            print(f'Epoch {epoch+1}, Gen Loss: {np.mean(history["gen_loss"][-batch_size:])}, Disc Loss: {np.mean(history["disc_loss"][-batch_size:])}')
        
        return history

    def generate_design(self, label, noise):
        generated_design = self.generator([noise[np.newaxis, ...], np.array([label])[np.newaxis, ...]], training=False)
        generated_design = (generated_design[0, ...] + 1) / 2.0  # Rescale to [0, 1]
        return generated_design.numpy()

    def save_model(self, generator_path, discriminator_path):
        self.generator.save(generator_path)
        self.discriminator.save(discriminator_path)

    def load_model(self, generator_path, discriminator_path):
        self.generator = tf.keras.models.load_model(generator_path)
        self.discriminator = tf.keras.models.load_model(discriminator_path)

    def design_to_image(self, design):
        design = (design * 255).astype(np.uint8)
        return Image.fromarray(design)

    def design_to_base64(self, design):
        img = self.design_to_image(design)
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()