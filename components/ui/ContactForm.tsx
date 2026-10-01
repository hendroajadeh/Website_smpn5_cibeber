'use client';

import { useState } from 'react';
import { PaperPlaneTilt, WhatsappLogo, CheckCircle } from '@phosphor-icons/react';

type ContactFormProps = {
  whatsappNumber?: string;
};

export default function ContactForm({ whatsappNumber = '6281234567890' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Orang Tua Siswa');
  const [subject, setSubject] = useState('Informasi PPDB 2025/2026');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Format template WhatsApp
    const waText = encodeURIComponent(
      `*Pesan Kontak Website SMPN 5 Cibeber*\n\n` +
      `*Nama:* ${name}\n` +
      `*No. Kontak:* ${phone || '-'}\n` +
      `*Status/Peran:* ${role}\n` +
      `*Subjek:* ${subject}\n\n` +
      `*Pesan:*\n${message}`
    );

    // Buka WhatsApp di tab baru
    window.open(`https://wa.me/${cleanWa}?text=${waText}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs">
      <h3 className="text-lg font-bold text-[#1E5631] mb-1">
        Kirim Pesan ke Pihak Sekolah
      </h3>
      <p className="text-xs sm:text-sm text-[#1E293B]/80 mb-6 leading-relaxed">
        Punya pertanyaan seputar PPDB, administrasi, atau kegiatan sekolah? Silakan isi formulir di bawah ini untuk terhubung langsung dengan pihak tata usaha/panitia.
      </p>

      {submitted ? (
        <div className="p-6 rounded-xl bg-[#1E5631]/5 border border-[#1E5631]/20 text-center space-y-3">
          <CheckCircle size={44} weight="fill" className="text-[#1E5631] mx-auto" />
          <h4 className="text-base font-bold text-[#1E5631]">
            Pesan Siap Dikirim!
          </h4>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-md mx-auto">
            Halaman WhatsApp telah dibuka untuk meneruskan pesan Anda. Panitia akan merespon pertanyaan Anda secepatnya pada jam kerja.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage('');
            }}
            className="btn btn-secondary btn-sm mt-2"
          >
            Kirim Pesan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label label-required">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Nomor WhatsApp / HP</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Status Anda</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
              >
                <option value="Orang Tua Siswa">Orang Tua / Wali Siswa</option>
                <option value="Calon Siswa Baru">Calon Siswa Baru</option>
                <option value="Alumni">Alumni</option>
                <option value="Masyarakat Umum">Masyarakat Umum / Mitra</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Subjek Pertanyaan</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input"
              >
                <option value="Informasi PPDB 2025/2026">Informasi PPDB 2025/2026</option>
                <option value="Legalisir & Berkas Ijazah">Legalisir & Berkas Ijazah</option>
                <option value="Mutasi / Pindah Masuk">Mutasi / Pindah Masuk</option>
                <option value="Pengaduan & Saran">Pengaduan & Saran</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label label-required">Pesan / Pertanyaan</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda tanyakan secara jelas..."
              className="input resize-none"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 bg-[#1E5631] hover:bg-[#164325] text-white shadow-md active:scale-95 transition-all duration-200"
          >
            <WhatsappLogo size={20} weight="fill" className="text-white" />
            <span>Kirim Pesan via WhatsApp Resmi</span>
            <PaperPlaneTilt size={16} weight="bold" />
          </button>
        </form>
      )}
    </div>
  );
}
