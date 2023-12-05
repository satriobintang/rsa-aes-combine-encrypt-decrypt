document.addEventListener('DOMContentLoaded', function() {
    // Generate Key
    document.getElementById('generate-key-button-aes').addEventListener('click', function() {
        const keyLength = document.querySelector('select[name="key-length-aes"]').value;
        fetch('/generate-key-aes', {
            method: 'POST',
            body: new URLSearchParams({ key_length: keyLength }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result-generated-key-aes').value = data.key;
        });
    });

    // Encrypt Text
    document.getElementById('encrypt-text-button-aes').addEventListener('click', function() {
        const plaintext = document.getElementById('plaintext-aes').value;
        const key = document.getElementById('encryption-key-aes').value;
        const keyLength = document.querySelector('select[name="key-length-aes"]').value;
        fetch('/encrypt-text-aes', {
            method: 'POST',
            body: new URLSearchParams({ plaintext, key, key_length: keyLength }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result-encrypted-text-aes').value = data.ciphertext;
        });
    });

    // Decrypt Text
    document.getElementById('decrypt-text-button-aes').addEventListener('click', function() {
        const ciphertext = document.getElementById('ciphertext-aes').value;
        const key = document.getElementById('decryption-key-aes').value;
        const keyLength = document.querySelector('select[name="key-length-aes"]').value;
        fetch('/decrypt-text-aes', {
            method: 'POST',
            body: new URLSearchParams({ ciphertext, key, key_length: keyLength }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result-decrypted-text-aes').value = data.decrypted_text;
        });
    });

    // Encrypt File
    document.getElementById('encrypt-file-button-aes').addEventListener('click', function() {
        const file = document.querySelector('#encryption-file-form-aes input[type="file"]').files[0];
        const key = document.getElementById('encryption-key-file-aes').value;
        const keyLength = document.querySelector('select[name="key-length-aes"]').value;
        if (file && key) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('key', key);
            formData.append('key_length', keyLength);
            fetch('/encrypt-file-aes', {
                method: 'POST',
                body: formData
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = "encrypted_" + file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert("Please select a file and enter a key.");
        }
    });

    document.getElementById('decrypt-file-button-aes').addEventListener('click', function() {
        const fileInput = document.querySelector('#decryption-file-form-aes input[type="file"]');
        const file = fileInput.files[0];
        const key = document.getElementById('decryption-key-file-aes').value;
        const keyLength = document.querySelector('select[name="key-length-aes"]').value;
        if (file && key) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('key', key);
            formData.append('key_length', keyLength);
            fetch('/decrypt-file-aes', {
                method: 'POST',
                body: formData
            })
            .then(response => response.blob())
            .then(blob => {
                const a = document.createElement('a');
                a.style.display = 'none';
                const originalFilename = file.name;
                const decryptedFilename = 'decrypted_' + originalFilename;
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = decryptedFilename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert("Please select a file and enter a key.");
        }
    });

    function saveAESKeyToFile(key, filename) {
        var blob = new Blob([key], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }

    document.getElementById('save-result-generated-key-button-aes').addEventListener('click', function() {
        var aesKey = document.getElementById('result-generated-key-aes').value; // Dapatkan kunci AES yang dihasilkan
        saveAESKeyToFile(aesKey, 'aes_key.txt'); // Simpan kunci AES ke file
    });  


    document.getElementById('use-result-generated-key-button-aes').addEventListener('click', function() {
        const aesKey = document.getElementById('result-generated-key-aes').value;
        document.getElementById('encryption-key-aes').value = aesKey;
        document.getElementById('decryption-key-aes').value = aesKey;
        document.getElementById('encryption-key-file-aes').value = aesKey;
        document.getElementById('decryption-key-file-aes').value = aesKey;
    });

    document.getElementById('use-ciphertext-aes').addEventListener('click', function() {
        const ciphertextAES = document.getElementById('result-encrypted-text-aes').value;
        document.getElementById('ciphertext-aes').value = ciphertextAES;
    });

    document.getElementById('use-decrypted-aes').addEventListener('click', function() {
        const decryptedAES = document.getElementById('result-decrypted-text-aes').value;
        document.getElementById('plaintext-aes').value = decryptedAES;
    });

    document.querySelector('#save-encrypted-file-text-aes').addEventListener('click', function() {
        const ciphertextAES = document.getElementById('result-encrypted-text-aes').value;
        saveTextAsFile(ciphertextAES, 'encrypted_text_AES.txt');
    });

    document.querySelector('#save-decrypted-file-text-aes').addEventListener('click', function() {
        const decryptedAES = document.getElementById('result-decrypted-text-aes').value;
        saveTextAsFile(decryptedAES, 'decrypted_text_AES.txt');
    });

    function saveTextAsFile(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Browse File Plaintext
    document.querySelector('#plaintext-aes-file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const plaintext = e.target.result;
                document.querySelector('#plaintext-aes').value = plaintext;
            };
            reader.readAsText(file);
        }
    });

    // Browse File Ciphertext
    document.querySelector('#ciphertext-aes-file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const ciphertext = e.target.result;
                document.querySelector('#ciphertext-aes').value = ciphertext;
            };
            reader.readAsText(file);
        }
    });

    // Browse File for Encryption Key Text
    document.querySelector('#key-aes-file-for-encrypt-text').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const encryptionKey = e.target.result;
                document.querySelector('#encryption-key-aes').value = encryptionKey;
            };
            reader.readAsText(file);
        }
    });

    // Browse File for Decryption Key Text
    document.querySelector('#key-aes-file-for-decrypt-text').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const decryptionKey = e.target.result;
                document.querySelector('#decryption-key-aes').value = decryptionKey;
            };
            reader.readAsText(file);
        }
    });

    // Browse File for Encryption Key File
    document.querySelector('#key-aes-file-for-encrypt-file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const encryptionKey = e.target.result;
                document.querySelector('#encryption-key-file-aes').value = encryptionKey;
            };
            reader.readAsText(file);
        }
    });

    // Browse File for Decryption Key File
    document.querySelector('#key-aes-file-for-decrypt-file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const decryptionKey = e.target.result;
                document.querySelector('#decryption-key-file-aes').value = decryptionKey;
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('clear-all-data-aes').addEventListener('click', function() {
        document.getElementById('result-generated-key-aes').value = '';
        document.getElementById('plaintext-aes').value = '';
        document.getElementById('encryption-key-aes').value = '';
        document.getElementById('decryption-key-aes').value = '';
        document.getElementById('ciphertext-aes').value = '';
        document.getElementById('encryption-key-file-aes').value = '';
        document.getElementById('decryption-key-file-aes').value = '';

        document.getElementById('plaintext-aes-file').value = '';
        document.getElementById('key-aes-file-for-encrypt').value = '';
        document.getElementById('key-aes-file-for-decrypt').value = '';
        document.getElementById('ciphertext-aes-file').value = '';

        document.getElementById('result-encrypted-text-aes').value = '';
        document.getElementById('result-decrypted-text-aes').value = '';
    });
});