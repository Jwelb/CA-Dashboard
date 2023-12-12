FROM nvcr.io/nvidia/cuda:12.3.1-runtime-ubuntu20.04

WORKDIR /llama

COPY requirements.txt .

# Install essential packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    wget \
    curl \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["torchrun", "--nproc_per_node", "1", "chat_completion.py", "--ckpt_dir", "llama-2-7b-chat/", "--tokenizer_path", "tokenizer.model", "--max_seq_len", "512", "--max_batch_size", "6"]
# Use a base image with Conda installed
# FROM continuumio/miniconda3

# # Set the working directory
# WORKDIR /app

# # Copy files into the image
# COPY requirements.txt .
# COPY setup.py .
# COPY environment.yml .

# # Create Conda environment
# RUN conda env create -f environment.yml

# # Activate the Conda environment and install pip dependencies
# RUN echo "conda activate py311" >> ~/.bashrc
# SHELL ["/bin/bash", "--login", "-c"]
# RUN conda run -n py311 pip install --no-cache-dir -r requirements.txt

# # Expose the necessary port
# EXPOSE 5000

# # Set the default command to run your application
# CMD ["torchrun", "--nproc_per_node", "1", "chat_completion.py", "--ckpt_dir", "llama-2-7b-chat/", "--tokenizer_path", "tokenizer.model", "--max_seq_len", "512", "--max_batch_size", "4"]
