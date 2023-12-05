document.addEventListener('DOMContentLoaded', function() {




  // ==================BUTTON GENERATE KEY FUNCTION RSA==================          
  // Generate RSA Key
  document.getElementById('generate-rsa-key').addEventListener('click', function() {
      var keyLength = document.getElementById('key-length-rsa').value;
      fetch('/generate-key-rsa', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: 'key-length=' + keyLength,
          })
          .then(response => response.json())
          .then(data => {
              document.getElementById('result-generated-key-public-key-rsa').value = data.public_key;
              document.getElementById('result-generated-key-private-key-rsa').value = data.private_key;
          })
          .catch(error => {
              console.error('Error:', error);
          });
  });

  // ==================BUTTON ENCRYPTION FUNCTION RSA==================          
  // RSA Encryption
  document.getElementById('encrypt-text-button-rsa').addEventListener('click', function() {
      var publicKey = document.getElementById('encryption-key-public-key-rsa').value;
      var plaintext = document.getElementById('plaintext-rsa-text-encryption').value;

      // Panggil endpoint /encrypt-rsa
      fetch('/encrypt-rsa', {
              method: 'POST',
              body: new URLSearchParams({
                  'public-key-encrypt': publicKey,
                  'plaintext': plaintext
              }),
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          })
          .then(response => response.json())
          .then(data => {
              if (data.hasOwnProperty('error')) {
                  document.getElementById('result-encrypted-text-rsa').value = `${data.error}`;
              } else {
                  document.getElementById('result-encrypted-text-rsa').value = data.ciphertext;
              }
          })
          .catch(error => {
              document.getElementById('result-encrypted-text-rsa').value = `${error}`;
          });
  });




  // ==================BUTTON DECRYPTION FUNCTION RSA==================           
  document.getElementById('decrypt-text-button-rsa').addEventListener('click', function() {
      var privateKey = document.getElementById('decryption-key-private-key-rsa').value;
      var ciphertext = document.getElementById('ciphertext-rsa-text-encryption').value;

      // Panggil endpoint /decrypt-rsa
      fetch('/decrypt-rsa', {
              method: 'POST',
              body: new URLSearchParams({
                  'private-key-decrypt': privateKey,
                  'ciphertext-decrypt': ciphertext
              }),
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          })
          .then(response => response.json())
          .then(data => {
              if (data.hasOwnProperty('error')) {
                  document.getElementById('result-decrypted-text-rsa').value = `${data.error}`;
              } else {
                  document.getElementById('result-decrypted-text-rsa').value = data.plaintext;
              }
          })
          .catch(error => {
              document.getElementById('result-decrypted-text-rsa').value = `${error}`;
          });
  });



  // ==================COPY PUBLIC KEY RSA==================           
  document.getElementById('copy-public-key-rsa-button').addEventListener('click', function() {
      var publicKeyTextArea = document.getElementById('result-generated-key-public-key-rsa');
      publicKeyTextArea.select();
      document.execCommand('copy');
  });
  // ==================COPY PRIVATE KEY RSA==================           
  document.getElementById('copy-private-key-rsa-button').addEventListener('click', function() {
      var publicKeyTextArea = document.getElementById('result-generated-key-private-key-rsa');
      publicKeyTextArea.select();
      document.execCommand('copy');
  });




  // ==================USING GENERATED PUBLIC KEY RSA==================           
  document.getElementById('use-generated-key-public-key-rsa-button').addEventListener('click', function() {
      var generatedPublicKeyTextArea = document.getElementById('result-generated-key-public-key-rsa');
      var generatedPublicKey = generatedPublicKeyTextArea.value;

      // Mengatur nilai textarea public key
      document.getElementById('encryption-key-public-key-rsa').value = generatedPublicKey;
  });

  // ==================USING GENERATED PRIVATE KEY RSA==================           
  document.getElementById('use-generated-key-private-key-rsa-button').addEventListener('click', function() {
      var generatedPublicKeyTextArea = document.getElementById('result-generated-key-private-key-rsa');
      var generatedPublicKey = generatedPublicKeyTextArea.value;

      // Mengatur nilai textarea public key
      document.getElementById('decryption-key-private-key-rsa').value = generatedPublicKey;
  });




  // ==================USING RESULT ENCRYPTED TEXT RSA==================      
  document.getElementById('use-result-encrypted-text-rsa-button').addEventListener('click', function() {
      var generatedPublicKeyTextArea = document.getElementById('result-encrypted-text-rsa');
      var generatedPublicKey = generatedPublicKeyTextArea.value;

      // Mengatur nilai textarea decrypted text
      document.getElementById('ciphertext-rsa-text-encryption').value = generatedPublicKey;
  });

  // ==================USING RESULT DECRYPTED TEXT RSA==================      
  document.getElementById('use-result-decrypted-text-rsa-button').addEventListener('click', function() {
      var generatedPublicKeyTextArea = document.getElementById('result-decrypted-text-rsa');
      var generatedPublicKey = generatedPublicKeyTextArea.value;

      // Mengatur nilai textarea encrypted text
      document.getElementById('plaintext-rsa-text-encryption').value = generatedPublicKey;
  });




  // ==================COPY ENCRYPTED TEXT RSA==================      
  document.getElementById('copy-encrypted-text-rsa-button').addEventListener('click', function() {
      var publicKeyTextArea = document.getElementById('result-encrypted-text-rsa');
      publicKeyTextArea.select();
      document.execCommand('copy');
  });
  // ==================COPY DECRYPTED TEXT RSA==================      
  document.getElementById('copy-decrypted-text-rsa-button').addEventListener('click', function() {
      var publicKeyTextArea = document.getElementById('result-decrypted-text-rsa');
      publicKeyTextArea.select();
      document.execCommand('copy');
  });




  // ==================SAVE PUBLIC KEY==================
  document.getElementById('save-public-key-button').addEventListener('click', function() {
      var publicKeyTextArea = document.getElementById('result-generated-key-public-key-rsa');
      var publicKeyText = publicKeyTextArea.value;

      if (!publicKeyText.trim()) {
          // Menampilkan pesan kesalahan jika tidak ada nilai dalam textarea
          document.getElementById('error-message-download-public-key-dialog').textContent = 'Tidak ada public key didalam text area!';
          $('#dialog-error-download-public-key').modal('show');
          return; // Keluar dari fungsi jika tidak ada nilai
      }

      try {
          // Membuat objek Blob dari teks
          var blob = new Blob([publicKeyText], {
              type: 'text/plain'
          });

          // Membuat elemen link untuk mengunduh
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Public_key_generated_result.txt';

          // Menambahkan elemen link ke dokumen
          document.body.appendChild(link);

          // Klik pada link secara otomatis
          link.click();

          // Menghapus elemen link dari dokumen
          document.body.removeChild(link);
      } catch (error) {
          // Menampilkan pesan kesalahan menggunakan modal
          document.getElementById('error-message-download-public-key-dialog').textContent = 'Error during download: ' + error.message;
          $('#dialog-error-download-public-key').modal('show');
      }
  });

  // ==================SAVE PRIVATE KEY==================
  document.getElementById('save-private-key-button').addEventListener('click', function() {
      var privateKeyTextArea = document.getElementById('result-generated-key-private-key-rsa');
      var privateKeyText = privateKeyTextArea.value;

      if (!privateKeyText.trim()) {
          // Menampilkan pesan kesalahan jika tidak ada nilai dalam textarea
          document.getElementById('error-message-download-private-key-dialog').textContent = 'Tidak ada private key didalam text area!';
          $('#dialog-error-download-private-key').modal('show');
          return; // Keluar dari fungsi jika tidak ada nilai
      }

      try {
          // Membuat objek Blob dari teks
          var blob = new Blob([privateKeyText], {
              type: 'text/plain'
          });

          // Membuat elemen link untuk mengunduh
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Private_key_generated_result.txt';

          // Menambahkan elemen link ke dokumen
          document.body.appendChild(link);

          // Klik pada link secara otomatis
          link.click();

          // Menghapus elemen link dari dokumen
          document.body.removeChild(link);
      } catch (error) {
          // Menampilkan pesan kesalahan menggunakan modal
          document.getElementById('error-message-download-private-key-dialog').textContent = 'Error during download: ' + error.message;
          $('#dialog-error-download-private-key').modal('show');
      }
  });




  // ==================SAVE ENCRYPTED RSA==================
  document.getElementById('save-encrypted-text-rsa-button').addEventListener('click', function() {
      var encryptedResultsTextArea = document.getElementById('result-encrypted-text-rsa');
      var encryptedResultsText = encryptedResultsTextArea.value;

      if (!encryptedResultsText.trim()) {
          // Menampilkan pesan kesalahan jika tidak ada nilai dalam textarea
          document.getElementById('error-message-download-rsa-encrypted-text-dialog').textContent = 'Tidak ada teks terenkripsi RSA dalam text area!';
          $('#dialog-error-download-rsa-encrypted-text').modal('show');
          return; // Keluar dari fungsi jika tidak ada nilai
      }

      try {
          // Membuat objek Blob dari teks
          var blob = new Blob([encryptedResultsText], {
              type: 'text/plain'
          });

          // Membuat elemen link untuk mengunduh
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Encrypted_RSA_text_result.txt';

          // Menambahkan elemen link ke dokumen
          document.body.appendChild(link);

          // Klik pada link secara otomatis
          link.click();

          // Menghapus elemen link dari dokumen
          document.body.removeChild(link);
      } catch (error) {
          // Menampilkan pesan kesalahan menggunakan modal
          document.getElementById('error-message-download-rsa-encrypted-text-dialog').textContent = 'Error during download: ' + error.message;
          $('#dialog-error-download-rsa-encrypted-text').modal('show');
      }
  });


  // ==================SAVE DECRYPTED RSA==================
  document.getElementById('save-decrypted-text-rsa-button').addEventListener('click', function() {
      var decryptedResultsTextArea = document.getElementById('result-decrypted-text-rsa');
      var decryptedResultsText = decryptedResultsTextArea.value;

      if (!decryptedResultsText.trim()) {
          // Menampilkan pesan kesalahan jika tidak ada nilai dalam textarea
          document.getElementById('error-message-download-rsa-decrypted-text-dialog').textContent = 'Tidak ada teks terdekripsi RSA dalam text area!';
          $('#dialog-error-download-rsa-decrypted-text').modal('show');
          return; // Keluar dari fungsi jika tidak ada nilai
      }

      try {
          // Membuat objek Blob dari teks
          var blob = new Blob([decryptedResultsText], {
              type: 'text/plain'
          });

          // Membuat elemen link untuk mengunduh
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Decrypted_RSA_text_result.txt';

          // Menambahkan elemen link ke dokumen
          document.body.appendChild(link);

          // Klik pada link secara otomatis
          link.click();

          // Menghapus elemen link dari dokumen
          document.body.removeChild(link);
      } catch (error) {
          // Menampilkan pesan kesalahan menggunakan modal
          document.getElementById('error-message-download-rsa-decrypted-text-dialog').textContent = 'Error during download: ' + error.message;
          $('#dialog-error-download-rsa-decrypted-text').modal('show');
      }
  });




  // ==================UPLOAD CIPHERTEXT RSA==================
  // Mendengarkan klik pada tombol file
  document.getElementById('upload-ciphertext-rsa-from-file-button').addEventListener('click', function() {
      // Memicu klik pada input file yang tersembunyi
      document.getElementById('upload-ciphertext-rsa-from-file-input').click();
  });

  // Mendengarkan perubahan pada input file Ciphertext
  document.getElementById('upload-ciphertext-rsa-from-file-input').addEventListener('change', function(event) {
      var fileInput = event.target;
      var textarea = document.getElementById('ciphertext-rsa-text-encryption');
      var statusElement = document.getElementById('input-ciphertext-rsa-text-encryption-status');

      // Memastikan bahwa file dipilih
      if (fileInput.files.length > 0) {
          var file = fileInput.files[0];

          // Memeriksa ekstensi file
          var fileName = file.name;
          var fileExtension = fileName.split('.').pop().toLowerCase();

          if (fileExtension === 'txt') {
              var reader = new FileReader();

              // Mengatur fungsi callback ketika file selesai dibaca
              reader.onload = function(e) {
                  // Mengambil isi file dan mengisinya ke dalam textarea
                  textarea.value = e.target.result;

                  // Menampilkan status ukuran dan karakter
                  var size = new Blob([textarea.value]).size;
                  var charCount = textarea.value.length;
                  statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
              };

              // Membaca isi file sebagai teks
              reader.readAsText(file);

              // Menyembunyikan pesan kesalahan
              console.log('File berhasil diunggah.');
          } else {
              // Menampilkan pesan kesalahan menggunakan modal
              document.getElementById('error-message-upload-ciphertext-from-file-dialog').textContent = 'File yang diunggah bukan file txt.';
              $('#dialog-error-upload-ciphertext-from-file-rsa').modal('show');
              textarea.value = ''; // Mengosongkan textarea
          }
      }
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-ciphertext-rsa-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-ciphertext-rsa-from-file-input');
      fileInput.value = null;
  });

  // Mendengarkan perubahan pada textarea
  document.getElementById('ciphertext-rsa-text-encryption').addEventListener('input', function() {
      updateStatus(this.value);
  });

  // Fungsi untuk mengupdate status ukuran dan karakter
  function updateStatus(text) {
      var statusElement = document.getElementById('input-ciphertext-rsa-text-encryption-status');
      var size = new Blob([text]).size; // Menghitung ukuran dalam byte
      var charCount = text.length;
      statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
  }

  // Mendengarkan perubahan pada textarea
  document.getElementById('ciphertext-rsa-text-encryption').addEventListener('input', function() {
      updateStatus(this.value);
  });




  // ==================UPLOAD PLAINTEXT RSA==================
  // Mendengarkan klik pada tombol file
  document.getElementById('upload-plaintext-rsa-from-file-button').addEventListener('click', function() {
      // Memicu klik pada input file yang tersembunyi
      document.getElementById('upload-plaintext-rsa-from-file-input').click();
  });

  // Mendengarkan perubahan pada input file Plaintext
  document.getElementById('upload-plaintext-rsa-from-file-input').addEventListener('change', function(event) {
      var fileInput = event.target;
      var textarea = document.getElementById('plaintext-rsa-text-encryption');
      var statusElement = document.getElementById('input-plaintext-rsa-text-encryption-status');

      // Memastikan bahwa file dipilih
      if (fileInput.files.length > 0) {
          var file = fileInput.files[0];

          // Memeriksa ekstensi file
          var fileName = file.name;
          var fileExtension = fileName.split('.').pop().toLowerCase();

          if (fileExtension === 'txt') {
              var reader = new FileReader();

              // Mengatur fungsi callback ketika file selesai dibaca
              reader.onload = function(e) {
                  // Mengambil isi file dan mengisinya ke dalam textarea
                  textarea.value = e.target.result;

                  // Menampilkan status ukuran dan karakter
                  var size = new Blob([textarea.value]).size;
                  var charCount = textarea.value.length;
                  statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
              };

              // Membaca isi file sebagai teks
              reader.readAsText(file);

              // Menyembunyikan pesan kesalahan
              console.log('File berhasil diunggah.');
          } else {
              // Menampilkan pesan kesalahan menggunakan modal
              document.getElementById('error-message-upload-plaintext-from-file-dialog').textContent = 'File yang diunggah bukan file txt.';
              $('#dialog-error-upload-plaintext-from-file-rsa').modal('show');
              textarea.value = ''; // Mengosongkan textarea
          }
      }
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-plaintext-rsa-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-plaintext-rsa-from-file-input');
      fileInput.value = null;
  });

  // Mendengarkan perubahan pada textarea
  document.getElementById('plaintext-rsa-text-encryption').addEventListener('input', function() {
      updateStatus(this.value, document.getElementById('input-plaintext-rsa-text-encryption-status'));
  });

  // Fungsi untuk mengupdate status ukuran dan karakter
  function updateStatus(text) {
      var statusElement = document.getElementById('input-plaintext-rsa-text-encryption-status');
      var size = new Blob([text]).size; // Menghitung ukuran dalam byte
      var charCount = text.length;
      statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
  }

  // Mendengarkan perubahan pada textarea
  document.getElementById('plaintext-rsa-text-encryption').addEventListener('input', function() {
      updateStatus(this.value);
  });



  // ==================UPLOAD PUBLIC KEY RSA==================
  // Mendengarkan klik pada tombol file untuk Public Key
  document.getElementById('upload-public-key-from-file-button').addEventListener('click', function() {
      // Memicu klik pada input file yang tersembunyi
      document.getElementById('upload-public-key-from-file-input').click();
  });

  // Mendengarkan perubahan pada input file untuk Public Key
  document.getElementById('upload-public-key-from-file-input').addEventListener('change', function(event) {
      var fileInput = event.target;
      var textarea = document.getElementById('encryption-key-public-key-rsa');
      var errorMessageDialog = document.getElementById('error-message-upload-public-key-from-file-dialog');

      // Memastikan bahwa file dipilih
      if (fileInput.files.length > 0) {
          var file = fileInput.files[0];

          // Memeriksa ekstensi file
          var fileName = file.name;
          var fileExtension = fileName.split('.').pop().toLowerCase();

          if (fileExtension === 'txt') {
              var reader = new FileReader();

              // Mengatur fungsi callback ketika file selesai dibaca
              reader.onload = function(e) {
                  // Mengambil isi file dan mengisinya ke dalam textarea Public Key
                  textarea.value = e.target.result;
              };

              // Membaca isi file sebagai teks
              reader.readAsText(file);

              // Menyembunyikan pesan kesalahan
              console.log('File berhasil diunggah.');
          } else {


              // Menampilkan pesan kesalahan menggunakan modal
              document.getElementById('error-message-upload-public-key-from-file-dialog').textContent = 'File yang diunggah bukan file txt.';
              $('#dialog-error-upload-public-key-from-file-rsa').modal('show');
              textarea.value = ''; // Mengosongkan textarea
          }
      }
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-public-key-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-public-key-from-file-input');
      fileInput.value = null;
  });


  // ==================UPLOAD PRIVATE KEY RSA==================
  // Mendengarkan klik pada tombol file untuk Private Key
  document.getElementById('upload-private-key-from-file-button').addEventListener('click', function() {
      // Memicu klik pada input file yang tersembunyi
      document.getElementById('upload-private-key-from-file-input').click();
  });

  // Mendengarkan perubahan pada input file untuk Private Key
  document.getElementById('upload-private-key-from-file-input').addEventListener('change', function(event) {
      var fileInput = event.target;
      var textarea = document.getElementById('decryption-key-private-key-rsa');
      var errorMessageDialog = document.getElementById('error-message-upload-private-key-from-file-dialog');

      // Memastikan bahwa file dipilih
      if (fileInput.files.length > 0) {
          var file = fileInput.files[0];

          // Memeriksa ekstensi file
          var fileName = file.name;
          var fileExtension = fileName.split('.').pop().toLowerCase();

          if (fileExtension === 'txt') {
              var reader = new FileReader();

              // Mengatur fungsi callback ketika file selesai dibaca
              reader.onload = function(e) {
                  // Mengambil isi file dan mengisinya ke dalam textarea Private Key
                  textarea.value = e.target.result;
              };

              // Membaca isi file sebagai teks
              reader.readAsText(file);

              // Menyembunyikan pesan kesalahan
              console.log('File berhasil diunggah.');
          } else {


              // Menampilkan pesan kesalahan menggunakan modal
              document.getElementById('error-message-upload-private-key-from-file-dialog').textContent = 'File yang diunggah bukan file txt.';
              $('#dialog-error-upload-private-key-from-file-rsa').modal('show');
              textarea.value = ''; // Mengosongkan textarea
          }
      }
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-private-key-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-private-key-from-file-input');
      fileInput.value = null;
  });




  // ==================COUNT SIZE AND CHARACTER PLAINTEXT RSA==================      
  // Mendengarkan perubahan pada textarea Plaintext
  document.getElementById('plaintext-rsa-text-encryption').addEventListener('input', function() {
      var textarea = this;
      var statusElement = document.getElementById('input-plaintext-rsa-text-encryption-status');

      // Menghitung ukuran dan jumlah karakter
      var size = new Blob([textarea.value]).size; // Menghitung ukuran dalam byte
      var charCount = textarea.value.length;

      // Menampilkan hasil perhitungan
      statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
  });

  // ==================COUNT SIZE AND CHARACTER CIPHERTEXT RSA==================      
  // Mendengarkan perubahan pada textarea Ciphertext
  document.getElementById('ciphertext-rsa-text-encryption').addEventListener('input', function() {
      var textarea = this;
      var statusElement = document.getElementById('input-ciphertext-rsa-text-encryption-status');

      // Menghitung ukuran dan jumlah karakter
      var size = new Blob([textarea.value]).size; // Menghitung ukuran dalam byte
      var charCount = textarea.value.length;

      // Menampilkan hasil perhitungan
      statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
  });




  // ==============CLEAR DECRYPTION BOX==============
  // Mendengarkan klik pada tombol "Clear Decryption Box"
  document.getElementById('clear-input-box-decrypt-button').addEventListener('click', function() {
      // Menghapus isi dari textarea
      document.getElementById('ciphertext-rsa-text-encryption').value = '';
      document.getElementById('decryption-key-private-key-rsa').value = '';
      document.getElementById('result-decrypted-text-rsa').value = '';

      // Menghapus informasi ukuran dan karakter
      document.getElementById('input-ciphertext-rsa-text-encryption-status').textContent = 'Size: 0 Bytes, 0 Characters';
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-ciphertext-rsa-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-ciphertext-rsa-from-file-input');
      fileInput.value = null;
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-private-key-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-private-key-from-file-input');
      fileInput.value = null;
  });

  // ==============CLEAR ENCRYPTION BOX==============
  // Mendengarkan klik pada tombol "Clear Encryption Box"
  document.getElementById('clear-input-box-encrypt-button').addEventListener('click', function() {
      // Menghapus isi dari textarea
      document.getElementById('plaintext-rsa-text-encryption').value = '';
      document.getElementById('encryption-key-public-key-rsa').value = '';
      document.getElementById('result-encrypted-text-rsa').value = '';

      // Menghapus informasi ukuran dan karakter
      document.getElementById('input-plaintext-rsa-text-encryption-status').textContent = 'Size: 0 Bytes, 0 Characters';
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-plaintext-rsa-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-ciphertext-rsa-from-file-input');
      fileInput.value = null;
  });

  // Membersihkan nilai input file setelah digunakan
  document.getElementById('upload-public-key-from-file-button').addEventListener('click', function() {
      var fileInput = document.getElementById('upload-public-key-from-file-input');
      fileInput.value = null;
  });

});