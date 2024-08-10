import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Footer from '../../components/Footer';
import { WA_NUMBER } from '../../utils/VarGlobe';

const Reseller = () => {

  function generateWhatsAppURL() {
    const message = `🌟 Selamat Datang di Maharani Eka! 🌟

Halo Admin,

Saya tertarik untuk menjadi reseller produk Maharani Eka. Mohon informasi lebih lanjut mengenai cara pendaftarannya.

Berikut beberapa pertanyaan yang saya miliki:

Bagaimana proses pendaftaran dan dokumen apa yang diperlukan?
Apakah ada biaya pendaftaran atau biaya lainnya?
Bagaimana sistem komisi dan pengiriman produk?
Adakah dukungan atau pelatihan yang disediakan untuk reseller baru?

Terima kasih banyak! 🙏😊`;
    return `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="seller-page pt-3">
      <Container>
        <Row>
          <Col>
            <h1 className='text-center'>Selamat Datang Reseller!</h1>
            <p className="text-center text-secondary">
              Bergabunglah dengan Kami dan Kembangkan Bisnis Anda!
            </p>
          </Col>
        </Row>
        <Row className="mt-3 mt-md-5">
          <Col>
            <Card className="shadow-sm p-4">
              <Card.Body>
                <h2 className="text-center mb-4 text-red">Syarat dan Ketentuan Menjadi Reseller</h2>
                <h5>1. Pendaftaran</h5>
                {/* <p>
                  Calon reseller harus mendaftar melalui kontak yang tersedia di halaman <Link to="/contact">kontak</Link>. 
                </p> */}
                <ul>
                  <li>Calon reseller telah melakukan pembelanjaan minimal 3x dalam kurun waktu 1 bulan (berlaku akumulatif).</li>
                  <li>Calon reseller harus mendaftar melalui kontak yang tersedia di halaman <Link to="/contact">kontak</Link>.</li>
                </ul>
                <h5>2. Persyaratan Umum</h5>
                <ul>
                  <li>Memiliki toko online atau offline yang aktif.</li>
                  <li>Bersedia mematuhi kebijakan dan prosedur yang ditetapkan oleh kami.</li>
                  <li>Bersedia melakukan promosi produk secara aktif.</li>
                </ul>
                <h5>3. Pembelian dan Penjualan</h5>
                <ul>
                  <li>Reseller harus membeli produk dengan harga khusus reseller yang telah ditentukan.</li>
                  <li>Reseller bertanggung jawab atas penjualan dan pengiriman produk kepada pelanggan mereka.</li>
                  <li>Tidak diizinkan menjual produk dengan harga di bawah harga yang telah ditentukan.</li>
                </ul>
                <h5>4. Pembayaran</h5>
                <p>
                  Pembayaran dilakukan secara penuh sebelum pengiriman barang. Metode pembayaran yang diterima akan diinformasikan saat pendaftaran.
                </p>
                <h5>5. Pengiriman</h5>
                <p>
                  Kami akan mengirimkan barang kepada reseller setelah pembayaran diterima. Reseller bertanggung jawab untuk mengatur pengiriman kepada pelanggan mereka.
                </p>
                <h5>6. Pengembalian dan Penukaran</h5>
                <p>
                  Pengembalian dan penukaran produk harus dilakukan sesuai dengan kebijakan yang berlaku. Barang yang dikembalikan harus dalam kondisi yang sama seperti saat diterima.
                </p>
                <h5>7. Komunikasi</h5>
                <p>
                  Reseller diharapkan untuk selalu berkomunikasi dengan kami mengenai stok, promosi, dan masalah lainnya yang berkaitan dengan penjualan produk.
                </p>
                <h5>8. Tanggung Jawab</h5>
                <p>
                  Reseller bertanggung jawab penuh atas kegiatan penjualan dan pelayanan kepada pelanggan mereka.
                </p>
                <h5>9. Penghentian Kerjasama</h5>
                <p>
                  Kami berhak menghentikan kerjasama dengan reseller yang melanggar syarat dan ketentuan yang berlaku.
                </p>
                <h5>10. Lain-lain</h5>
                {/* <p>
                  Syarat dan ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Reseller diharapkan untuk selalu mengikuti update terbaru.
                </p> */}
                <ul>
                  <li>Discount Reseller 10% untuk semua produk.</li>
                  <li>Untuk Harga Tas Authentic Harga bisa berubah sewaktu-waktu karena mengikuti Harga Dollar.</li>
                  <li>Syarat dan ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Reseller diharapkan untuk selalu mengikuti update terbaru.</li>
                </ul>
                <div className='d-flex justify-content-center'>
                  <button className="btn btn-outline-red-ts rounded-0 hero-button text-red py-3 px-4 mt-3"
                      as="a" href={generateWhatsAppURL()} target="_blank"
                  >
                    Bergabunglah Bersama Kami <i className="ms-3 d-none d-sm-inline bi bi-arrow-right"></i>
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default Reseller;
