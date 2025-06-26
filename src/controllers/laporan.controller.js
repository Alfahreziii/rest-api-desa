const Penduduk = require('../models/penduduk');
const Laporan = require('../models/laporan');
const ManualLaporan = require('../models/laporanmanual');
const dayjs = require('dayjs');

exports.getAllLaporan = async (req, res) => {
  try {
    const manualReports = await ManualLaporan.query().orderBy('bulan_tahun', 'desc');

    const semuaPenduduk = await Penduduk.query();

    const laporanGabungan = manualReports.map((manual) => {
      const tanggal_laporan = dayjs(manual.bulan_tahun).startOf('month').format('YYYY-MM-DD');

      const pendudukPerBulan = semuaPenduduk; // kamu bisa filter per bulan jika perlu

      const jumlahKK = new Set(pendudukPerBulan.map(p => p.nomor_kk)).size;
      const jumlahLaki = pendudukPerBulan.filter(p => p.jenis_kelamin === 'Laki-laki').length;
      const jumlahPerempuan = pendudukPerBulan.filter(p => p.jenis_kelamin === 'Perempuan').length;
      const jumlahLahir = pendudukPerBulan.filter(p =>
        dayjs(p.tgl_lahir).isSame(tanggal_laporan, 'month')
      ).length;

      return {
        id: manual.id,
        tanggal_laporan,
        jumlah_rumah: manual.jumlah_rumah,
        jumlah_kk: jumlahKK,
        jumlah_laki: jumlahLaki,
        jumlah_perempuan: jumlahPerempuan,
        jumlah_meninggal: manual.jumlah_meninggal,
        jumlah_lahir: jumlahLahir,
        jumlah_pindah: manual.jumlah_pindah,
      };
    });

    return res.status(200).json(laporanGabungan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data laporan gabungan', error: error.message });
  }
};


exports.createMonthlyLaporan = async (req, res) => {
  try {
    const tanggal_laporan = dayjs().format('YYYY-MM');
    
    // Ambil data manual laporan jika ada
    const manualData = await ManualLaporan.query()
      .where('bulan_tahun', tanggal_laporan)
      .first();

    const jumlah_rumah = manualData?.jumlah_rumah || 0;
    const jumlah_meninggal = manualData?.jumlah_meninggal || 0;
    const jumlah_pindah = manualData?.jumlah_pindah || 0;

    // Ambil data penduduk
    const semuaPenduduk = await Penduduk.query();
    const jumlahKK = new Set(semuaPenduduk.map(p => p.nomor_kk)).size;
    const jumlahLaki = semuaPenduduk.filter(p => p.jenis_kelamin === 'Laki-laki').length;
    const jumlahPerempuan = semuaPenduduk.filter(p => p.jenis_kelamin === 'Perempuan').length;
    const jumlahLahir = semuaPenduduk.filter(p =>
      dayjs(p.tgl_lahir).isSame(tanggal_laporan, 'month')
    ).length;

    // Cek apakah laporan bulan ini sudah ada
    const existing = await Laporan.query().where('tanggal_laporan', tanggal_laporan).first();

    const dataToSave = {
      tanggal_laporan,
      jumlah_rumah,
      jumlah_kk: jumlahKK,
      jumlah_laki: jumlahLaki,
      jumlah_perempuan: jumlahPerempuan,
      jumlah_meninggal,
      jumlah_lahir: jumlahLahir,
      jumlah_pindah
    };

    let laporan;
    if (existing) {
      // 🔁 Update jika sudah ada
      laporan = await Laporan.query().patchAndFetchById(existing.id, dataToSave);
      if (res) return res.status(200).json({ message: 'Laporan bulan ini diupdate', laporan });
      console.log(`[Cron] Laporan bulan ${tanggal_laporan} diupdate.`);
    } else {
      // ➕ Insert baru
      laporan = await Laporan.query().insert(dataToSave);
      if (res) return res.status(201).json({ message: 'Laporan bulan ini dibuat', laporan });
      console.log(`[Cron] Laporan bulan ${tanggal_laporan} berhasil dibuat.`);
    }

  } catch (err) {
    console.error(`[Cron] Gagal membuat/update laporan bulanan:`, err.message);
    if (res) {
      return res.status(500).json({ message: 'Gagal memproses laporan bulanan', error: err.message });
    }
  }
};

