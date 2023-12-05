document.addEventListener('DOMContentLoaded', function() {

	// Function to show/hide sections based on button click
	function toggleSection(sectionId) {
		// Hide all sections
		document.querySelectorAll('.toggle-section').forEach(section => {
			section.style.display = 'none';
		});

		// Show the selected section
		document.getElementById(sectionId).style.display = 'block';

		// Update button classes based on active state
		updateButtonClasses(sectionId);
	}

	// Function to update button classes based on active state
	function updateButtonClasses(activeSectionId) {
		// Reset classes for all buttons
		document.getElementById('generate-aes-and-rsa-key-button-section').classList.remove('active');
		document.getElementById('encrypt-aes--and-rsa-button-section').classList.remove('active');
		document.getElementById('decrypt-aes-and-rsa-button-section').classList.remove('active');

		// Set active class for the button corresponding to the active section
		if (activeSectionId === 'generate-aes-and-rsa-key-section') {
			document.getElementById('generate-aes-and-rsa-key-button-section').classList.add('active');
		} else if (activeSectionId === 'encrypt-aes-and-rsa-section') {
			document.getElementById('encrypt-aes--and-rsa-button-section').classList.add('active');
		} else if (activeSectionId === 'decrypt-aes-and-rsa-section') {
			document.getElementById('decrypt-aes-and-rsa-button-section').classList.add('active');
		}
	}

	// Event listener for "Generate Key" button
	document.getElementById('generate-aes-and-rsa-key-button-section').addEventListener('click', function(e) {
		e.preventDefault(); // Prevent the default behavior of the link
		toggleSection('generate-aes-and-rsa-key-section');
	});

	// Event listener for "AES Encrypt" button
	document.getElementById('encrypt-aes--and-rsa-button-section').addEventListener('click', function(e) {
		e.preventDefault(); // Prevent the default behavior of the link
		toggleSection('encrypt-aes-and-rsa-section');
	});

	// Event listener for "AES Decrypt" button
	document.getElementById('decrypt-aes-and-rsa-button-section').addEventListener('click', function(e) {
		e.preventDefault(); // Prevent the default behavior of the link
		toggleSection('decrypt-aes-and-rsa-section');
	});

	// Show "Generate Key" section by default when the page loads
	toggleSection('generate-aes-and-rsa-key-section');


	// =======================GENERATE AES KEY=======================
	document.getElementById('generate-aes-key').addEventListener('click', function() {
		// Ambil panjang kunci dari dropdown
		var keyLength = document.getElementById('key-length-aes').value;

		// Kirim permintaan POST ke server Flask
		fetch('/generate-key-aes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: 'key_length=' + keyLength,
			})
			.then(response => response.json())
			.then(data => {
				// Periksa apakah ada kunci yang dihasilkan
				if (data.key) {
					// Tampilkan hasil di textarea
					document.getElementById('result-generated-key-aes').value = data.key;
				} else {
					// Tampilkan pesan kesalahan menggunakan modal
					document.getElementById('error-message-generate-aes-key-dialog').textContent = 'Error generating AES key.';
					$('#dialog-error-generate-aes-key').modal('show');
				}
			})
			.catch(error => {
				// Tampilkan pesan kesalahan menggunakan modal
				document.getElementById('error-message-generate-aes-key-dialog').textContent = 'Error: ' + error.message;
				$('#dialog-error-generate-aes-key').modal('show');
			});
	});













	// =======================ENCRYPTION TEXT BUTTON AES=======================
	document.getElementById('encrypt-text-button-aes').addEventListener('click', function() {
		var plaintext = document.getElementById('plaintext-aes-text-encryption').value;
		var key = document.getElementById('aes-key-for-encryption-text').value;

		// Check if plaintext and key are provided
		if (!plaintext || !key) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Enkripsi Teks AES Gagal',
				text: 'Pastikan sudah menginputkan plaintext dan kunci AES!',
				showConfirmButton: true
			});
			return; // Exit the function if plaintext or key is missing
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

		fetch('/encrypt-text-aes', {
				method: 'POST',
				body: new URLSearchParams({
					plaintext,
					key
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(response => {
				if (!response.ok) {
					throw new Error('Encryption failed');
				}
				return response.json();
			})
			.then(data => {
				if (data.hasOwnProperty('error')) {
					// Show Error Modal
					Swal.fire({
						icon: 'error',
						title: 'Enkripsi Teks AES Gagal',
						text: 'Pastikan plaintext dan kunci AES yang digunakan valid!',
						showConfirmButton: true
					});
				} else {
					// Show Success Modal
					Swal.fire({
						icon: 'success',
						title: 'Proses enkripsi file AES berhasil',
						text: 'Enkripsi AES berhasil!',
						showConfirmButton: true
					});

					document.getElementById('result-encrypted-text-aes').value = data.ciphertext;
				}
			})
			.catch(error => {
				// Show Error Modal
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: error.message,
					showConfirmButton: true
				});
			})
			.finally(() => {
				// Close SweetAlert2 modal
				loadingModal.close();
			});
	});



	// =======================DECRYPTION TEXT BUTTON AES=======================
	document.getElementById('decrypt-text-button-aes').addEventListener('click', function() {
		var ciphertext = document.getElementById('ciphertext-aes-text-encryption').value;
		var key = document.getElementById('aes-key-for-decryption-text').value;

		// Check if ciphertext and key are provided
		if (!ciphertext || !key) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Dekripsi Teks AES Gagal',
				text: 'Pastikan sudah menginputkan ciphertext dan kunci AES!',
				showConfirmButton: true
			});
			return; // Exit the function if ciphertext or key is missing
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

		fetch('/decrypt-text-aes', {
				method: 'POST',
				body: new URLSearchParams({
					ciphertext,
					key
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(response => {
				if (!response.ok) {
					throw new Error('Decryption failed');
				}
				return response.json();
			})
			.then(data => {
				if (data.hasOwnProperty('error')) {
					// Show Error Modal
					Swal.fire({
						icon: 'error',
						title: 'Dekripsi Teks AES Gagal',
						text: 'Pastikan ciphertext dan kunci AES yang digunakan valid!',
						showConfirmButton: true
					});
				} else {
					// Show Success Modal
					Swal.fire({
						icon: 'success',
						title: 'Proses dekripsi file AES berhasil',
						text: 'Dekripsi AES berhasil!',
						showConfirmButton: true
					});

					document.getElementById('result-decrypted-text-aes').value = data.decrypted_text;
				}
			})
			.catch(error => {
				// Show Error Modal
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Proses dekripsi teks gagal. ' + error.message,
					showConfirmButton: true
				});
			})
			.finally(() => {
				// Close SweetAlert2 modal
				loadingModal.close();
			});
	});







	// ==================COPY AES KEY==================           
	document.getElementById('copy-key-aes-button').addEventListener('click', function() {
		var aesKeyTextArea = document.getElementById('result-generated-key-aes');
		aesKeyTextArea.select();
		document.execCommand('copy');
	});















	// ==================COPY ENCRYPTED TEXT aes==================      
	document.getElementById('copy-encrypted-text-aes-button').addEventListener('click', function() {
		var EncryptedTextAesTextArea = document.getElementById('result-encrypted-text-aes');
		EncryptedTextAesTextArea.select();
		document.execCommand('copy');
	});

	// ==================COPY DECRYPTED TEXT aes==================      
	document.getElementById('copy-decrypted-text-aes-button').addEventListener('click', function() {
		var DecryptedTextAesTextArea = document.getElementById('result-decrypted-text-aes');
		DecryptedTextAesTextArea.select();
		document.execCommand('copy');
	});



	// ==================SAVE AES KEY==================






	// ==================SAVE AES ENCRYPTED RESULTS==================
	document.getElementById('save-encrypted-text-aes-button').addEventListener('click', function() {
		var encryptedResultsTextArea = document.getElementById('result-encrypted-text-aes');
		var encryptedResultsText = encryptedResultsTextArea.value;

		// Check if the encrypted text is empty
		if (!encryptedResultsText.trim()) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Warning',
				text: 'Tidak ada teks terenkripsi AES dalam textarea!',
				showConfirmButton: true
			});
			return; // Exit the function if there is no value
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

		try {
			// Create a Blob object from the text
			var blob = new Blob([encryptedResultsText], {
				type: 'text/plain'
			});

			// Create a link element for downloading
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'Encrypted_Aes_text_result.txt';

			// Add the link element to the document
			document.body.appendChild(link);

			// Click on the link automatically
			link.click();

			// Remove the link element from the document
			document.body.removeChild(link);

			// Show Success Modal
			Swal.fire({
				icon: 'success',
				title: 'Proses penyimpanan berhasil',
				text: 'Encrypted AES text saved successfully',
				showConfirmButton: true
			});
		} catch (error) {
			// Show Error Modal
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Error during download: ' + error.message,
				showConfirmButton: true
			});
		} finally {
			// Close SweetAlert2 modal
			loadingModal.close();
		}
	});



	// ==================SAVE DECRYPTED AES==================
	document.getElementById('save-decrypted-text-aes-button').addEventListener('click', function() {
		var decryptedResultsTextArea = document.getElementById('result-decrypted-text-aes');
		var decryptedResultsText = decryptedResultsTextArea.value;

		// Check if the decrypted text is empty
		if (!decryptedResultsText.trim()) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Warning',
				text: 'Tidak ada teks terdekripsi AES dalam textarea!',
				showConfirmButton: true
			});
			return; // Exit the function if there is no value
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

		try {
			// Create a Blob object from the text
			var blob = new Blob([decryptedResultsText], {
				type: 'text/plain'
			});

			// Create a link element for downloading
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'decrypted_Aes_text_result.txt';

			// Add the link element to the document
			document.body.appendChild(link);

			// Click on the link automatically
			link.click();

			// Remove the link element from the document
			document.body.removeChild(link);

			// Show Success Modal
			Swal.fire({
				icon: 'success',
				title: 'Proses penyimpanan berhasil',
				text: 'Decrypted AES text saved successfully',
				showConfirmButton: true
			});
		} catch (error) {
			// Show Error Modal
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Error during download: ' + error.message,
				showConfirmButton: true
			});
		} finally {
			// Close SweetAlert2 modal
			loadingModal.close();
		}
	});

















	// ==================UPLOAD PLAINTEXT AES==================
	// Mendengarkan klik pada tombol file
	document.getElementById('upload-plaintext-aes-from-file-button').addEventListener('click', function() {
		// Memicu klik pada input file yang tersembunyi
		document.getElementById('upload-plaintext-aes-from-file-input').click();
	});

	// Mendengarkan perubahan pada input file Plaintext
	document.getElementById('upload-plaintext-aes-from-file-input').addEventListener('change', function(event) {
		var fileInput = event.target;
		var textarea = document.getElementById('plaintext-aes-text-encryption');
		var statusElement = document.getElementById('input-plaintext-aes-text-encryption-status');

		// Memastikan bahwa file dipilih
		if (fileInput.files.length > 0) {
			var file = fileInput.files[0];

			// Memeriksa ekstensi file
			var fileName = file.name;
			var fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension === 'txt') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter
					var maxCharacterLimit = 1000000; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 1juta karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
						updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea
						textarea.value = fileContent;

						// Menampilkan status ukuran dan karakter
						updateStatus(textarea.value, statusElement);

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'Plaintext berhasil diunggah dari file.',
							showConfirmButton: true
						});
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
				updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
			}
		}
	});


	// Membersihkan nilai input file setelah digunakan
	document.getElementById('upload-plaintext-aes-from-file-button').addEventListener('click', function() {
		var fileInput = document.getElementById('upload-plaintext-aes-from-file-input');
		fileInput.value = null;
	});

	// Mendengarkan perubahan pada textarea
	document.getElementById('plaintext-aes-text-encryption').addEventListener('input', function() {
		updateStatus(this.value, document.getElementById('input-plaintext-aes-text-encryption-status'));
	});

	// Fungsi untuk mengupdate status ukuran dan karakter
	function updateStatus(text, statusElement) {
		var size = new Blob([text]).size; // Menghitung ukuran dalam byte
		var charCount = text.length;
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	}






	// ==================UPLOAD CIPHERTEXT AES==================
	// Mendengarkan klik pada tombol file
	document.getElementById('upload-ciphertext-aes-from-file-button').addEventListener('click', function() {
		// Memicu klik pada input file yang tersembunyi
		document.getElementById('upload-ciphertext-aes-from-file-input').click();
	});

	// Mendengarkan perubahan pada input file Ciphertext
	document.getElementById('upload-ciphertext-aes-from-file-input').addEventListener('change', function(event) {
		var fileInput = event.target;
		var textarea = document.getElementById('ciphertext-aes-text-encryption');
		var statusElement = document.getElementById('input-ciphertext-aes-text-encryption-status');

		// Memastikan bahwa file dipilih
		if (fileInput.files.length > 0) {
			var file = fileInput.files[0];

			// Memeriksa ekstensi file
			var fileName = file.name;
			var fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension === 'txt') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter
					var maxCharacterLimit = 1000000; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 1juta karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
						updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea
						textarea.value = fileContent;

						// Menampilkan status ukuran dan karakter
						updateStatus(textarea.value, statusElement);

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'Ciphertext berhasil diunggah dari file.',
							showConfirmButton: true
						});
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
				updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
			}
		}
	});


	// Membersihkan nilai input file setelah digunakan
	document.getElementById('upload-ciphertext-aes-from-file-button').addEventListener('click', function() {
		var fileInput = document.getElementById('upload-ciphertext-aes-from-file-input');
		fileInput.value = null;
	});

	// Mendengarkan perubahan pada textarea Ciphertext
	document.getElementById('ciphertext-aes-text-encryption').addEventListener('input', function() {
		updateStatus(this.value, document.getElementById('input-ciphertext-aes-text-encryption-status'));
	});

	// Fungsi untuk mengupdate status ukuran dan karakter
	function updateStatus(text, statusElement) {
		var size = new Blob([text]).size; // Menghitung ukuran dalam byte
		var charCount = text.length;
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	}




	// ==================UPLOAD AES KEY FOR ENCRYPTION==================
	// Mendengarkan klik pada tombol file untuk AES Key
	document.getElementById('upload-aes-key-for-encrypt-from-file-button').addEventListener('click', function() {
		// Memicu klik pada input file yang tersembunyi
		document.getElementById('upload-aes-key-for-encrypt-from-file-input').click();
	});

	// Mendengarkan perubahan pada input file untuk AES Key
	document.getElementById('upload-aes-key-for-encrypt-from-file-input').addEventListener('change', function(event) {
		var fileInput = event.target;
		var textarea = document.getElementById('aes-key-for-encryption-text');
		var errorMessageDialog = document.getElementById('dialog-error-upload-aes-key-for-encrypt-from-file');

		// Memastikan bahwa file dipilih
		if (fileInput.files.length > 0) {
			var file = fileInput.files[0];

			// Memeriksa ekstensi file
			var fileName = file.name;
			var fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension === 'txt') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea AES Key
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter dengan benar, termasuk karakter khusus
					var maxCharacterLimit = 100; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 100 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea AES Key
						textarea.value = fileContent;

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'AES Key berhasil diunggah dari file.',
							showConfirmButton: true
						});

						// Menyembunyikan pesan kesalahan
						console.log('File berhasil diunggah.');
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
			}
		}
	});

	// Fungsi untuk menghitung karakter dengan benar, termasuk karakter khusus
	function countCharacters(text) {
		var charCount = 0;
		for (var i = 0; i < text.length; i++) {
			// Memeriksa apakah karakter saat ini adalah karakter baris baru atau karakter kembali
			if (text[i] !== '\n' && text[i] !== '\r') {
				charCount++;
			}
		}
		return charCount;
	}


	// Membersihkan nilai input file setelah digunakan
	document.getElementById('upload-aes-key-for-encrypt-from-file-button').addEventListener('click', function() {
		var fileInput = document.getElementById('upload-aes-key-for-encrypt-from-file-input');
		fileInput.value = null;
	});




	// ==================UPLOAD AES KEY FOR DECRYPTION==================
	// Mendengarkan klik pada tombol file untuk AES Key
	document.getElementById('upload-aes-key-for-decrypt-from-file-button').addEventListener('click', function() {
		// Memicu klik pada input file yang tersembunyi
		document.getElementById('upload-aes-key-for-decrypt-from-file-input').click();
	});

	// Mendengarkan perubahan pada input file untuk AES Key
	document.getElementById('upload-aes-key-for-decrypt-from-file-input').addEventListener('change', function(event) {
		var fileInput = event.target;
		var textarea = document.getElementById('aes-key-for-decryption-text');
		var errorMessageDialog = document.getElementById('dialog-error-upload-aes-key-for-decrypt-from-file');

		// Memastikan bahwa file dipilih
		if (fileInput.files.length > 0) {
			var file = fileInput.files[0];

			// Memeriksa ekstensi file
			var fileName = file.name;
			var fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension === 'txt') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea AES Key
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter dengan benar, termasuk karakter khusus
					var maxCharacterLimit = 100; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					// Menutup loading modal
					loadingModal.close();

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 100 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea AES Key
						textarea.value = fileContent;

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'AES Key berhasil diunggah dari file.',
							showConfirmButton: true
						});

						// Menyembunyikan pesan kesalahan
						console.log('File berhasil diunggah.');
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
			}
		}
	});

	// Membersihkan nilai input file setelah digunakan
	document.getElementById('upload-aes-key-for-decrypt-from-file-button').addEventListener('click', function() {
		var fileInput = document.getElementById('upload-aes-key-for-decrypt-from-file-input');
		fileInput.value = null;
	});




	// ==================UPLOAD AES KEY FOR ENCRYPTION FILE==================
	// Mendengarkan klik pada tombol file untuk AES Key
	document.getElementById('upload-aes-key-for-encrypt-file-from-file-button').addEventListener('click', function() {
		// Memicu klik pada input file yang tersembunyi
		document.getElementById('upload-aes-key-for-encrypt-file-from-file-input').click();
	});

	// Mendengarkan perubahan pada input file untuk AES Key
	document.getElementById('upload-aes-key-for-encrypt-file-from-file-input').addEventListener('change', function(event) {
		var fileInput = event.target;
		var textarea = document.getElementById('aes-key-for-encryption-file');
		var errorMessageDialog = document.getElementById('dialog-error-upload-aes-key-for-encrypt-file-from-file');

		// Memastikan bahwa file dipilih
		if (fileInput.files.length > 0) {
			var file = fileInput.files[0];

			// Memeriksa ekstensi file
			var fileName = file.name;
			var fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension === 'txt') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea AES Key
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter dengan benar, termasuk karakter khusus
					var maxCharacterLimit = 100; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 100 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea AES Key
						textarea.value = fileContent;

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'AES Key berhasil diunggah dari file.',
							showConfirmButton: true
						});

						// Menyembunyikan pesan kesalahan
						console.log('File berhasil diunggah.');
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
			}
		}
	});


	// Membersihkan nilai input file setelah digunakan
	document.getElementById('upload-aes-key-for-encrypt-file-from-file-button').addEventListener('click', function() {
		var fileInput = document.getElementById('upload-aes-key-for-encrypt-file-from-file-input');
		fileInput.value = null;
	});





	// ==================UPLOAD AES KEY FOR DECRYPTION FILE==================
	// Mendengarkan klik pada tombol file untuk AES Key
	document.getElementById('upload-aes-key-for-decrypt-file-from-file-button').addEventListener('click', function() {
		// Memicu klik pada input file yang tersembunyi
		document.getElementById('upload-aes-key-for-decrypt-file-from-file-input').click();
	});

	// Mendengarkan perubahan pada input file untuk AES Key
	document.getElementById('upload-aes-key-for-decrypt-file-from-file-input').addEventListener('change', function(event) {
		var fileInput = event.target;
		var textarea = document.getElementById('aes-key-for-decryption-file');
		var errorMessageDialog = document.getElementById('dialog-error-upload-aes-key-for-decrypt-file-from-file');

		// Memastikan bahwa file dipilih
		if (fileInput.files.length > 0) {
			var file = fileInput.files[0];

			// Memeriksa ekstensi file
			var fileName = file.name;
			var fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension === 'txt') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea AES Key
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter dengan benar, termasuk karakter khusus
					var maxCharacterLimit = 100; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 100 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea AES Key
						textarea.value = fileContent;

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'AES Key berhasil diunggah dari file.',
							showConfirmButton: true
						});

						// Menyembunyikan pesan kesalahan
						console.log('File berhasil diunggah.');
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
			}
		}
	});


	// Membersihkan nilai input file setelah digunakan
	document.getElementById('upload-aes-key-for-decrypt-file-from-file-button').addEventListener('click', function() {
		var fileInput = document.getElementById('upload-aes-key-for-decrypt-file-from-file-input');
		fileInput.value = null;
	});

	// ==============CLEAR DECRYPTION FILE==============

	// Mendengarkan klik pada tombol untuk menghapus nilai input
	document.getElementById('clear-input-box-decrypt-file-button').addEventListener('click', function() {
		// Menghapus nilai dari textarea kunci AES untuk dekripsi file
		document.getElementById('aes-key-for-decryption-file').value = '';

		// Menghapus nilai dari input file untuk dekripsi file
		document.getElementById('input-file-for-decryption-aes').value = '';
	});

	// ==============CLEAR ENCRYPTION FILE==============
	// Mendengarkan klik pada tombol untuk menghapus nilai input
	document.getElementById('clear-input-box-encrypt-file-button').addEventListener('click', function() {
		// Menghapus nilai dari textarea kunci AES untuk enkripsi file
		document.getElementById('aes-key-for-encryption-file').value = '';

		// Menghapus nilai dari input file untuk enkripsi file
		document.getElementById('input-file-for-encryption-aes').value = '';
	});


	// ==============CLEAR ENCRYPTION BOX==============

	// Mendengarkan klik pada tombol untuk menghapus nilai input
	document.getElementById('clear-input-box-encrypt-button').addEventListener('click', function() {
		// Menghapus nilai dari textarea plaintext
		document.getElementById('plaintext-aes-text-encryption').value = '';

		// Menghapus nilai dari textarea kunci AES
		document.getElementById('aes-key-for-encryption-text').value = '';

		// Menghapus nilai dari textarea hasil enkripsi AES
		document.getElementById('result-encrypted-text-aes').value = '';

		// Mengupdate status ukuran dan karakter textarea plaintext menjadi 0
		updateStatus('', document.getElementById('input-plaintext-aes-text-encryption-status'));
	});

	// Fungsi untuk mengupdate status ukuran dan karakter
	function updateStatus(text, statusElement) {
		var size = new Blob([text]).size; // Menghitung ukuran dalam byte
		var charCount = text.length;
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	}





	// ==============CLEAR DECRYPTION BOX==============
	// Mendengarkan klik pada tombol untuk menghapus nilai input dekripsi
	document.getElementById('clear-input-box-decrypt-button').addEventListener('click', function() {
		// Menghapus nilai dari textarea ciphertext
		document.getElementById('ciphertext-aes-text-encryption').value = '';

		// Menghapus nilai dari textarea kunci AES untuk dekripsi
		document.getElementById('aes-key-for-decryption-text').value = '';

		// Menghapus nilai dari textarea hasil dekripsi AES
		document.getElementById('result-decrypted-text-aes').value = '';

		// Mengupdate status ukuran dan karakter textarea ciphertext menjadi 0
		updateStatus('', document.getElementById('input-ciphertext-aes-text-encryption-status'));
	});

	// Fungsi untuk mengupdate status ukuran dan karakter
	function updateStatus(text, statusElement) {
		var size = new Blob([text]).size; // Menghitung ukuran dalam byte
		var charCount = text.length;
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	}



	// ==================COUNT SIZE AND CHARACTER PLAINTEXT aes==================      
	// Mendengarkan perubahan pada textarea Plaintext
	document.getElementById('plaintext-aes-text-encryption').addEventListener('input', function() {
		var textarea = this;
		var statusElement = document.getElementById('input-plaintext-aes-text-encryption-status');

		// Menghitung ukuran dan jumlah karakter
		var size = new Blob([textarea.value]).size; // Menghitung ukuran dalam byte
		var charCount = textarea.value.length;

		// Menampilkan hasil perhitungan
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	});

	// ==================COUNT SIZE AND CHARACTER CIPHERTEXT aes==================      
	// Mendengarkan perubahan pada textarea Ciphertext
	document.getElementById('ciphertext-aes-text-encryption').addEventListener('input', function() {
		var textarea = this;
		var statusElement = document.getElementById('input-ciphertext-aes-text-encryption-status');

		// Menghitung ukuran dan jumlah karakter
		var size = new Blob([textarea.value]).size; // Menghitung ukuran dalam byte
		var charCount = textarea.value.length;

		// Menampilkan hasil perhitungan
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	});



	// =======================ENCRYPTION FILE AES=======================
	document.getElementById('encrypt-file-button-aes').addEventListener('click', function() {
		var inputFile = document.getElementById('input-file-for-encryption-aes').files[0];
		var aesKey = document.getElementById('aes-key-for-encryption-file').value;

		// Maksimum ukuran file (dalam byte)
		var maxFileSize = 2 * 1024 * 1024 * 1024; // 2 GB

		// Membuat AbortController
		var abortController = new AbortController();

		if (inputFile && aesKey) {
			// Pemeriksaan ukuran file
			if (inputFile.size > maxFileSize) {
				// Menampilkan alert jika melebihi batas
				Swal.fire({
					icon: 'warning',
					title: 'File Terlalu Besar',
					text: 'Maksimum ukuran file yang diizinkan adalah 2 GB.',
					showConfirmButton: true
				});
				return; // Menghentikan proses jika ukuran file melebihi batas
			}

			// Show loading modal with spinner
			var loadingModal = Swal.fire({
				title: 'Sedang memproses',
				text: 'Harap tunggu...',
				allowOutsideClick: false,
				showConfirmButton: false,
				showCancelButton: true,
				cancelButtonText: 'Batal',
				onBeforeOpen: () => {
					Swal.showLoading();
				}
			});

			// Set the signal abort on the controller
			var signal = abortController.signal;

			var keyBytes = new TextEncoder().encode(aesKey);
			var formData = new FormData();
			formData.append('file', inputFile);
			formData.append('key', btoa(String.fromCharCode.apply(null, keyBytes)));

			fetch('/encrypt-file-aes', {
					method: 'POST',
					body: formData,
					signal: signal // Add the signal to the fetch
				})
				.then(response => {
					if (!response.ok) {
						throw new Error('Pastikan file dan kunci AES yang digunakan valid!');
					}
					return response.blob();
				})
				.then(blob => {
					var url = URL.createObjectURL(blob);
					var originalFilename = inputFile.name.replace(/\.[^/.]+$/, '');
					var encryptedFilename = `encrypted_${originalFilename}${inputFile.name.slice(originalFilename.length)}.encrypted`;

					var link = document.createElement('a');
					link.href = url;
					link.download = encryptedFilename;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					// Show Success Modal
					Swal.fire({
						icon: 'success',
						title: 'Proses enkripsi file AES berhasil',
						text: 'Enkripsi file AES berhasil diunduh!',
						showConfirmButton: true
					});
				})
				.catch(error => {
					// Check if the error is an AbortError (user cancellation)
					if (error.name !== 'AbortError') {
						console.error('Encryption error:', error);

						// Show Error Modal
						Swal.fire({
							icon: 'error',
							title: 'Enkripsi File AES Gagal',
							text: error.message,
							showConfirmButton: true
						});
					}
				})
				.finally(() => {
					// Close SweetAlert2 modal
					loadingModal.close();
				});
		} else {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Enkripsi File AES Gagal',
				text: 'Pastikan sudah menginputkan file dan kunci AES!'
			});
		}

		// Add an event listener to the Cancel button
		Swal.getCancelButton().addEventListener('click', function() {
			// Disable the warning when the user cancels the request
			abortController.abort();
		});
	});



	// =======================DECRYPTION FILE AES=======================
	document.getElementById('decrypt-file-button-aes').addEventListener('click', function() {
		// Get the selected file from the input
		var inputFile = document.getElementById('input-file-for-decryption-aes').files[0];

		// Get the AES key from the textarea
		var aesKey = document.getElementById('aes-key-for-decryption-file').value;

		// Create an AbortController
		var abortController = new AbortController();

		// Maksimum ukuran file (dalam byte)
		var maxFileSize = 2 * 1024 * 1024 * 1024; // 2 GB

		// Check if both file and key are provided
		if (inputFile && aesKey) {
			// Pemeriksaan ukuran file
			if (inputFile.size > maxFileSize) {
				// Menampilkan alert jika melebihi batas
				Swal.fire({
					icon: 'warning',
					title: 'File Terlalu Besar',
					text: 'Maksimum ukuran file yang diizinkan adalah 2 GB.',
					showConfirmButton: true
				});
				return; // Menghentikan proses jika ukuran file melebihi batas
			}

			// Show loading modal
			var loadingModal = Swal.fire({
				title: 'Sedang memproses',
				text: 'Harap tunggu...',
				allowOutsideClick: false,
				showConfirmButton: false,
				showCancelButton: true,
				cancelButtonText: 'Batal',
				onBeforeOpen: () => {
					Swal.showLoading();
				}
			});

			// Read the AES key as bytes
			var keyBytes = new TextEncoder().encode(aesKey);

			// Create a FormData object to send the file and key to the server
			var formData = new FormData();
			formData.append('file', inputFile);
			formData.append('key', btoa(String.fromCharCode.apply(null, keyBytes))); // Convert key to base64

			// Set the signal abort on the controller
			var signal = abortController.signal;

			fetch('/decrypt-file-aes', {
					method: 'POST',
					body: formData,
					signal: signal // Add the signal to the fetch
				})
				.then(response => {
					if (!response.ok) {
						throw new Error('Pastikan file dan kunci AES yang digunakan valid!');
					}
					return response.blob();
				})
				.then(blob => {
					var url = URL.createObjectURL(blob);
					var originalFilename = inputFile.name.replace(/\.[^/.]+$/, '');

					var decryptedFilename;
					if (originalFilename.startsWith('decrypted_')) {
						decryptedFilename = originalFilename;
					} else {
						if (originalFilename.endsWith('.encrypted')) {
							decryptedFilename = originalFilename.slice(0, -('.encrypted'.length));
						} else {
							decryptedFilename = `decrypted_${originalFilename}`;
						}
					}

					var link = document.createElement('a');
					link.href = url;
					link.download = decryptedFilename;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					// Show Success Modal
					Swal.fire({
						icon: 'success',
						title: 'Proses dekripsi file AES berhasil',
						text: 'Dekripsi file AES berhasil diunduh!',
						showConfirmButton: true
					});

				})
				.catch(error => {
					// Check if the error is an AbortError (user cancellation)
					if (error.name !== 'AbortError') {
						console.error('Decryption error:', error);

						// Show Error Modal
						Swal.fire({
							icon: 'error',
							title: 'Dekripsi File AES Gagal',
							text: error.message,
							showConfirmButton: true
						});
					}
				})
				.finally(() => {
					// Close SweetAlert2 modal
					loadingModal.close();
				});
		} else {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Dekripsi File AES Gagal',
				text: 'Pastikan sudah menginputkan file dan kunci AES!'
			});
		}

		// Add an event listener to the Cancel button
		Swal.getCancelButton().addEventListener('click', function() {
			// Disable the warning when the user cancels the request
			abortController.abort();
		});
	});






















	// =============================RSA===========================



	// ==================BUTTON ENCRYPTION FUNCTION RSA==================
	// RSA Encryption
	document.getElementById('encrypt-text-button-rsa').addEventListener('click', function() {
		var publicKey = document.getElementById('encryption-key-public-key-rsa').value;
		var plaintext = document.getElementById('plaintext-rsa-text-encryption').value;

		// Check if publicKey and plaintext are provided
		if (!publicKey || !plaintext) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Enkripsi Teks RSA Gagal',
				text: 'Pastikan sudah menginputkan kunci publik dan plaintext!',
				showConfirmButton: true
			});
			return; // Exit the function if publicKey or plaintext is missing
		}

		// Check if plaintext length exceeds the maximum allowed length
		var keyLength = getRsaKeyLength(publicKey);
		var maxByteLength = getMaxByteLength(keyLength);
		var plaintextByteLength = new TextEncoder().encode(plaintext).length;

		if (plaintextByteLength > maxByteLength) {
			// Show Error Modal with detailed information
			Swal.fire({
				icon: 'error',
				title: 'Enkripsi Teks RSA Gagal',
				html: `Panjang teks melebihi batas maksimum untuk panjang bit kunci RSA yang digunakan!<br>
                   Jumlah karakter sekarang: ${plaintextByteLength}<br>
                   Batas maksimal: ${maxByteLength}`,
				showConfirmButton: true
			});
			return; // Exit the function if plaintext length exceeds the maximum allowed length
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

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
			.then(response => {
				if (!response.ok) {
					throw new Error('Encryption failed');
				}
				return response.json();
			})
			.then(data => {
				if (data.hasOwnProperty('error')) {
					// Show Error Modal
					Swal.fire({
						icon: 'error',
						title: 'Enkripsi Teks RSA Gagal',
						text: 'Pastikan kunci publik dan plaintext yang digunakan valid!',
						showConfirmButton: true
					});
				} else {
					// Show Success Modal
					Swal.fire({
						icon: 'success',
						title: 'Proses enkripsi file RSA berhasil',
						text: 'Enkripsi RSA berhasil!',
						showConfirmButton: true
					});

					document.getElementById('result-encrypted-text-rsa').value = data.ciphertext;
				}
			})
			.catch(error => {
				// Show Error Modal
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: error.message,
					showConfirmButton: true
				});
			})
			.finally(() => {
				// Close SweetAlert2 modal
				loadingModal.close();
			});
	});

	// Fungsi untuk mendapatkan panjang bit kunci RSA dari kunci publik
	function getRsaKeyLength(publicKey) {
		try {
			var parsedKey = new JSEncrypt();
			parsedKey.setPublicKey(publicKey);
			return parsedKey.getKey().n.bitLength();
		} catch (error) {
			return 0;
		}
	}

	// Fungsi untuk memeriksa apakah teks adalah base64-encoded
	function isValidBase64(text) {
		try {
			return btoa(atob(text)) == text;
		} catch (e) {
			return false;
		}
	}

	function getMaxByteLength(keyLength) {
		const maxByteLengthMap = {
			'1024': 62,
			'2048': 190,
			'3072': 318,
			'4096': 446,
			'8192': 958
		};
		return maxByteLengthMap[keyLength] || 62;
	}




	// ==================BUTTON DECRYPTION FUNCTION RSA==================           
	document.getElementById('decrypt-text-button-rsa').addEventListener('click', function() {
		var privateKey = document.getElementById('decryption-key-private-key-rsa').value;
		var ciphertext = document.getElementById('ciphertext-rsa-text-encryption').value;

		// Check if privateKey and ciphertext are provided
		if (!privateKey || !ciphertext) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Dekripsi Teks RSA Gagal',
				text: 'Pastikan sudah menginputkan kunci privat dan ciphertext!',
				showConfirmButton: true
			});
			return; // Exit the function if privateKey or ciphertext is missing
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

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
			.then(response => {
				if (!response.ok) {
					throw new Error('Decryption failed');
				}
				return response.json();
			})
			.then(data => {
				if (data.hasOwnProperty('error')) {
					// Show Error Modal
					Swal.fire({
						icon: 'error',
						title: 'Dekripsi Teks RSA Gagal',
						text: 'Pastikan kunci privat dan ciphertext yang digunakan valid!',
						showConfirmButton: true
					});
				} else {
					// Show Success Modal
					Swal.fire({
						icon: 'success',
						title: 'Proses dekripsi file RSA berhasil',
						text: 'Dekripsi RSA berhasil!',
						showConfirmButton: true
					});

					document.getElementById('result-decrypted-text-rsa').value = data.plaintext;
				}
			})
			.catch(error => {
				// Show Error Modal
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: error.message,
					showConfirmButton: true
				});
			})
			.finally(() => {
				// Close SweetAlert2 modal
				loadingModal.close();
			});
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




	// ==================SAVE ENCRYPTED RSA==================
	document.getElementById('save-encrypted-text-rsa-button').addEventListener('click', function() {
		var encryptedResultsTextArea = document.getElementById('result-encrypted-text-rsa');
		var encryptedResultsText = encryptedResultsTextArea.value;

		// Check if the encrypted RSA text is empty
		if (!encryptedResultsText.trim()) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Warning',
				text: 'Tidak ada teks terenkripsi RSA dalam textarea!',
				showConfirmButton: true
			});
			return; // Exit the function if there is no value
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

		try {
			// Create a Blob object from the text
			var blob = new Blob([encryptedResultsText], {
				type: 'text/plain'
			});

			// Create a link element for downloading
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'Encrypted_RSA_text_result.txt';

			// Add the link element to the document
			document.body.appendChild(link);

			// Click on the link automatically
			link.click();

			// Remove the link element from the document
			document.body.removeChild(link);

			// Show Success Modal
			Swal.fire({
				icon: 'success',
				title: 'Proses penyimpanan berhasil',
				text: 'Encrypted RSA text saved successfully',
				showConfirmButton: true
			});
		} catch (error) {
			// Show Error Modal
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Error during download: ' + error.message,
				showConfirmButton: true
			});
		} finally {
			// Close SweetAlert2 modal
			loadingModal.close();
		}
	});



	// ==================SAVE DECRYPTED RSA==================
	document.getElementById('save-decrypted-text-rsa-button').addEventListener('click', function() {
		var decryptedResultsTextArea = document.getElementById('result-decrypted-text-rsa');
		var decryptedResultsText = decryptedResultsTextArea.value;

		// Check if the decrypted RSA text is empty
		if (!decryptedResultsText.trim()) {
			// Show Error Modal
			Swal.fire({
				icon: 'warning',
				title: 'Warning',
				text: 'Tidak ada teks terdekripsi RSA dalam textarea!',
				showConfirmButton: true
			});
			return; // Exit the function if there is no value
		}

		// Show loading modal
		var loadingModal = Swal.fire({
			title: 'Sedang memproses',
			text: 'Harap tunggu...',
			allowOutsideClick: false,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Batal',
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});

		try {
			// Create a Blob object from the text
			var blob = new Blob([decryptedResultsText], {
				type: 'text/plain'
			});

			// Create a link element for downloading
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'Decrypted_RSA_text_result.txt';

			// Add the link element to the document
			document.body.appendChild(link);

			// Click on the link automatically
			link.click();

			// Remove the link element from the document
			document.body.removeChild(link);

			// Show Success Modal
			Swal.fire({
				icon: 'success',
				title: 'Proses penyimpanan berhasil',
				text: 'Decrypted RSA text saved successfully',
				showConfirmButton: true
			});
		} catch (error) {
			// Show Error Modal
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Error during download: ' + error.message,
				showConfirmButton: true
			});
		} finally {
			// Close SweetAlert2 modal
			loadingModal.close();
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

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter
					var maxCharacterLimit = 1000; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 1000 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
						updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea
						textarea.value = fileContent;

						// Menampilkan status ukuran dan karakter
						updateStatus(textarea.value, statusElement);

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'Ciphertext berhasil diunggah dari file.',
							showConfirmButton: true
						});
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
				updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
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
		updateStatus(this.value, document.getElementById('input-ciphertext-rsa-text-encryption-status'));
	});

	// Fungsi untuk mengupdate status ukuran dan karakter
	function updateStatus(text, statusElement) {
		var size = new Blob([text]).size; // Menghitung ukuran dalam byte
		var charCount = text.length;
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	}



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

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea
					var fileContent = e.target.result;

					// Memeriksa jumlah karakter
					var maxCharacterLimit = 1000; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 1000 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
						updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea
						textarea.value = fileContent;

						// Menampilkan status ukuran dan karakter
						updateStatus(textarea.value, statusElement);

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'Plaintext berhasil diunggah dari file.',
							showConfirmButton: true
						});
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file txt.',
					showConfirmButton: true
				});

				textarea.value = ''; // Mengosongkan textarea
				updateStatus('', statusElement); // Reset status to 0 Bytes, 0 Characters
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
	function updateStatus(text, statusElement) {
		var size = new Blob([text]).size; // Menghitung ukuran dalam byte
		var charCount = text.length;
		statusElement.textContent = 'Size: ' + size + ' Bytes, ' + charCount + ' Characters';
	}




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

			if (fileExtension === 'pem') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea Public Key
					var publicKeyContent = e.target.result;

					// Memeriksa jumlah karakter
					var maxCharacterLimit = 4000; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 4000 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea Public Key
						textarea.value = publicKeyContent;

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'Public Key berhasil diunggah dari file.',
							showConfirmButton: true
						});
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file pem.',
					showConfirmButton: true
				});

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

			if (fileExtension === 'pem') {
				var reader = new FileReader();

				// Menampilkan loading modal
				var loadingModal = Swal.fire({
					title: 'Sedang memproses',
					text: 'Harap tunggu...',
					allowOutsideClick: false,
					showConfirmButton: false,
					onBeforeOpen: () => {
						Swal.showLoading();
					}
				});

				// Mengatur fungsi callback ketika file selesai dibaca
				reader.onload = function(e) {
					// Menutup loading modal
					loadingModal.close();

					// Mengambil isi file dan mengisinya ke dalam textarea Private Key
					var privateKeyContent = e.target.result;

					// Memeriksa jumlah karakter
					var maxCharacterLimit = 4000; // Ganti dengan batas karakter yang diinginkan
					var actualCharacterCount = countCharacters(fileContent);

					if (actualCharacterCount > maxCharacterLimit) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Karakter terlalu banyak. Pilih file dengan karakter yang lebih sedikit. Maksimal 4000 karakter!',
							showConfirmButton: true
						});

						textarea.value = ''; // Mengosongkan textarea
					} else {
						// Mengambil isi file dan mengisinya ke dalam textarea Private Key
						textarea.value = privateKeyContent;

						// Menampilkan modal sukses
						Swal.fire({
							icon: 'success',
							title: 'File berhasil diunggah',
							text: 'Private Key berhasil diunggah dari file.',
							showConfirmButton: true
						});
					}
				};

				// Membaca isi file sebagai teks
				reader.readAsText(file);
			} else {
				// Menampilkan pesan kesalahan menggunakan SweetAlert
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'File yang diunggah bukan file pem.',
					showConfirmButton: true
				});

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


	// Fungsi untuk menghitung karakter dengan benar, termasuk karakter khusus
	function countCharacters(text) {
		var charCount = 0;
		for (var i = 0; i < text.length; i++) {
			// Memeriksa apakah karakter saat ini adalah karakter baris baru atau karakter kembali
			if (text[i] !== '\n' && text[i] !== '\r') {
				charCount++;
			}
		}
		return charCount;
	}



});