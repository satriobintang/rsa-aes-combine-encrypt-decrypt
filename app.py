from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home/home.html')


# @app.route('/')
# def home():
#     return render_template('rsa_encrypt_decrypt.html')

@app.route('/about')
def about_us():
    return render_template('home/about.html')

@app.route('/rsa')
def rsa_page():
    return render_template('home/rsa_encrypt_decrypt.html')

@app.route('/aes')
def aes_page():
    return render_template('home/aes_encrypt_decrypt.html')

@app.route('/rsa_aes')
def rsa_aes_page():
    return render_template('home/rsa_and_aes_combine_encrypt_decrypt.html')

# ======================================= #
# ================= RSA ================= #
# ======================================= #
from flask import Flask, request, render_template, jsonify
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
import base64
from flask import Blueprint, render_template

@app.route('/generate-key-rsa', methods=['POST'])
def generate_key_rsa():
    key_length = int(request.form['key-length'])
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=key_length
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    return jsonify({
        'private_key': private_pem.decode('utf-8'),
        'public_key': public_pem.decode('utf-8')
    })
    
@app.route('/encrypt-rsa', methods=['POST'])
def encrypt_rsa():
    public_key_pem = request.form['public-key-encrypt'].encode('utf-8')
    plaintext = request.form['plaintext'].encode('utf-8')
    
    try:
        public_key = serialization.load_pem_public_key(public_key_pem)
        ciphertext = public_key.encrypt(
            plaintext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    
        # Encode the ciphertext to base64 before returning it
        ciphertext_base64 = base64.b64encode(ciphertext).decode('utf-8')
    
        return {'ciphertext': ciphertext_base64}
    except Exception as e:
        return {'error': 'Encryption error: Public key used is invalid or incorrect!'}

@app.route('/decrypt-rsa', methods=['POST'])
def decrypt_rsa():
    private_key_pem = request.form['private-key-decrypt'].encode('utf-8')
    ciphertext_base64 = request.form['ciphertext-decrypt']  # Tidak perlu encode
    ciphertext = base64.b64decode(ciphertext_base64)  # Decode base64 ke byte string

    try:
        private_key = serialization.load_pem_private_key(private_key_pem, password=None)
        plaintext_bytes = private_key.decrypt(
            ciphertext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    
        plaintext = plaintext_bytes.decode('utf-8')  # Konversi byte string menjadi string
    
        return {'plaintext': plaintext}
    except Exception as e:
        return {'error': 'Decryption error: Private key used is invalid or incorrect!'}




# ======================================= #
# ================= AES ================= #
# ======================================= #
from io import BytesIO
from flask import send_file
from werkzeug.utils import secure_filename
from Crypto.Util.Padding import pad, unpad
from flask import Flask, render_template, request, jsonify, send_file
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import os

# Fungsi untuk generate kunci
def generate_key_aes(key_length):
    return get_random_bytes(key_length // 8)

def encrypt_aes(key, plaintext, key_length):
    iv = get_random_bytes(AES.block_size)
    cipher = AES.new(key[:key_length], AES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(plaintext)
    return iv + ciphertext

def decrypt_aes(key, ciphertext, key_length):
    iv = ciphertext[:AES.block_size]
    ciphertext = ciphertext[AES.block_size:]
    cipher = AES.new(key[:key_length], AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(ciphertext)
    return plaintext




# Fungsi untuk menyimpan kunci ke file
def save_key_to_file(key, filename):
    with open(filename, 'wb') as file:
        file.write(key)

# Fungsi untuk membaca kunci dari file
def load_key_from_file(filename):
    with open(filename, 'rb') as file:
        return file.read()



@app.route('/generate-key-aes', methods=['POST'])
def generate_aes_key():
    key_length = int(request.form.get('key_length'))
    print("Panjang kunci generate key :", key_length)

    generated_key = generate_key_aes(key_length)
    print("Hasil generate key :", generated_key)
    
    kunci_aes_encode = base64.b64encode(generated_key).decode('utf-8')
    print("Kunci aes base 64 :", kunci_aes_encode)
    return jsonify({'key': base64.b64encode(generated_key).decode('utf-8'), 'key_length': key_length})


@app.route('/save_key', methods=['POST'])
def save_aes_key():
    key = base64.b64decode(request.form.get('key').encode('utf-8'))
    key_filename = request.form.get('key_filename')
    save_key_to_file(key, key_filename)
    return "Key saved successfully!"

@app.route('/encrypt-text-aes', methods=['POST'])
def encrypt_text_aes():
    try:
        key = request.form['key']
        plaintext = request.form['plaintext'].encode('utf-8')
        # print("plaintext ", plaintext)

        # Decode the base64-encoded key
        key = base64.b64decode(key.encode('utf-8'))
        print("Key ", key)
        key_length = len(key)
        print("Key Length perbaikan enkripsi :", key_length)

        # Ensure the plaintext is padded to a multiple of 16 bytes (AES block size)
        plaintext = pad(plaintext, key_length)

        # Perbarui pemanggilan encrypt untuk menyertakan panjang bit kunci
        ciphertext = encrypt_aes(key, plaintext, key_length)
        # print("Ciphertext ", ciphertext)

        # Encode the ciphertext as base64 and return it
        ciphertext = base64.b64encode(ciphertext).decode('utf-8')
        return jsonify({'ciphertext': ciphertext})

    except Exception as e:
        # Kesalahan umum lainnya
        error_message = "Proses enkripsi gagal, pastikan plaintext dan kunci yang diinputkan valid!"
        return jsonify({'error': error_message})
    
    

@app.route('/decrypt-text-aes', methods=['POST'])
def decrypt_text_aes():
    try:
        ciphertext = base64.b64decode(request.form.get('ciphertext').encode('utf-8'))
        # print("ciphertext :", ciphertext)

        key = base64.b64decode(request.form.get('key').encode('utf-8'))
        print("Key dekripsi :", key)

        key_length = len(key)
        print("Key Length perbaikan dekripsi:", key_length)

        decrypted_data = decrypt_aes(key, ciphertext, key_length)
        # print("Decryptedd data sebelum unpad :", decrypted_data)

        # Remove padding from decrypted data
        decrypted_data = unpad(decrypted_data, key_length)
        # print("Decryptedd data unpad :", decrypted_data)

        decrypted_text = decrypted_data.decode('utf-8')
        return jsonify({'decrypted_text': decrypted_text})

    except Exception as e:
        # Kesalahan umum lainnya
        error_message = "Proses dekripsi gagal, pastikan ciphertext dan kunci yang diinputkan valid!"
        return jsonify({'error': error_message})


@app.route('/encrypt-file-aes', methods=['POST'])
def encrypt_file_aes():
    key = base64.b64decode(request.form.get('key').encode('utf-8'))
    file = request.files['file'].read()  # Read the file data
    print("Kunci enkripsi file :", key)

    # Mendekode dari byte string menggunakan base64
    key = base64.b64decode(key)
    print("Decode Key :", key)

    key_length = len(key)
    print("Panjang Kunci :", key_length)


    # Ensure the file data is padded to a multiple of AES block size
    file = pad(file, key_length)

    encrypted_data = encrypt_aes(key, file, key_length)

    # Create an in-memory file object to send back to the user
    encrypted_file = BytesIO(encrypted_data)

    return send_file(encrypted_file, as_attachment=True, download_name='encrypted_file.bin')





@app.route('/decrypt-file-aes', methods=['POST'])
def decrypt_file_aes():
    key = base64.b64decode(request.form.get('key').encode('utf-8'))
    file = request.files['file'].read()  # Read the file data

    # Mendekode dari byte string menggunakan base64
    key = base64.b64decode(key)
    print("Decode Key :", key)

    key_length = len(key)
    print("Key Length perbaikan dekripsi file :", key_length)


    decrypted_data = decrypt_aes(key, file, key_length)

    # Remove padding from decrypted data
    decrypted_data = unpad(decrypted_data, key_length)

    # Create an in-memory file object to send back to the user
    decrypted_file = BytesIO(decrypted_data)

    return send_file(decrypted_file, as_attachment=True, download_name='decrypted_file.bin')


if __name__ == '__main__':
    app.run(debug=True)
