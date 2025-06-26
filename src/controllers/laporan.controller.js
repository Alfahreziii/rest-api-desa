const Penduduk = require('../models/penduduk');
const Laporan = require('../models/laporan');
const ManualLaporan = require('../models/laporanmanual');
const dayjs = require('dayjs');

exports.getAllLaporan = async (req, res) => {
  try {
    const today = dayjs();
    const manualReports = await ManualLaporan.query().orderBy('bulan_tahun', 'desc');
    const laporanBulanan = await Laporan.query();
    const semuaPenduduk = await Penduduk.query();

    const laporanGabungan = manualReports.map((manual) => {
      const bulanIni = dayjs(manual.bulan_tahun).isSame(today, 'month');

      let jumlahKK, jumlahLaki, jumlahPerempuan, jumlahLahir;

      if (bulanIni) {
        // Real-time dari data penduduk
        jumlahKK = new Set(semuaPenduduk.map(p => p.nomor_kk)).size;
        jumlahLaki = semuaPenduduk.filter(p => p.jenis_kelamin === 'Laki-laki').length;
        jumlahPerempuan = semuaPenduduk.filter(p => p.jenis_kelamin === 'Perempuan').length;
        jumlahLahir = semuaPenduduk.filter(p =>
          dayjs(p.tgl_lahir).isSame(manual.bulan_tahun, 'month')
        ).length;
      } else {
        // Snapshot dari laporan bulanan
        const laporan = laporanBulanan.find(
          (l) => dayjs(l.tanggal_laporan).format('YYYY-MM') === dayjs(manual.bulan_tahun).format('YYYY-MM')
        );
        jumlahKK = laporan?.jumlah_kk ?? 0;
        jumlahLaki = laporan?.jumlah_laki ?? 0;
        jumlahPerempuan = laporan?.jumlah_perempuan ?? 0;
        jumlahLahir = laporan?.jumlah_lahir ?? 0;
      }

      return {
        id: manual.id,
        tanggal_laporan: dayjs(manual.bulan_tahun).startOf('month').format('YYYY-MM'),
        jumlah_rumah: manual.jumlah_rumah,
        jumlah_penduduk: jumlahLaki + jumlahPerempuan,
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

