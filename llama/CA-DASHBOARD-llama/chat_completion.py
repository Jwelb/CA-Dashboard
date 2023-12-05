# Copyright (c) Meta Platforms, Inc. and affiliates.
# This software may be used and distributed according to the terms of the Llama 2 Community License Agreement.

from llama import Llama
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
model = Flask(__name__)

# Configure CORS to allow specific origins
CORS(model)  # Adjust the origin and max age as needed

@model.route('/chatQuery', methods =['GET','OPTIONS'])

def main(
    ckpt_dir='llama-2-7b-chat/',
    tokenizer_path='tokenizer.model',
    temperature = 0.6,
    top_p = 0.9,
    max_seq_len = 512,
    max_batch_size = 6,
    max_gen_len = None,
    ):
        data = request.args.get('question') # Json data from React
        print(data)

        generator = Llama.build(
            ckpt_dir=ckpt_dir,
            tokenizer_path=tokenizer_path,
            max_seq_len=max_seq_len,
            max_batch_size=max_batch_size,
        )

        # this is the text input for the model
        dialogs = [
            [{"role": "user", "content": data}]]

        results = generator.chat_completion(
            dialogs,  # type: ignore
            max_gen_len=max_gen_len,
            temperature=temperature,
            top_p=top_p,
        )
        # I changed this to return the results for the response
        return jsonify(results)



# so we generate a response from the model from the inputed data through the request.json
# get the ckpt_dir and tokenizer path from the script 
# ckpt_dir = llama-2-7b-chat/
# tokenizer path = tokenizer.model
# max_seq_len = 512
# max_batch_size = 4

if __name__ == "__main__":
    # fire.Fire(main)
    model.run(debug=True)
    









