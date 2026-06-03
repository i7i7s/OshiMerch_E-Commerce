<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password – OshiMerch</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        {{-- Header --}}
        <tr>
          <td style="background:linear-gradient(135deg,#7C3AED 0%,#EC4899 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">⭐ OshiMerch</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Marketplace Merch Idol Terpercaya</p>
          </td>
        </tr>

        {{-- Body --}}
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">

            {{-- Icon + Title --}}
            <div style="text-align:center;margin-bottom:28px;">
              <div style="display:inline-block;background:#EDE9FE;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;text-align:center;">🔐</div>
              <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#1F2937;">Reset Password</h1>
              <p style="margin:0;font-size:15px;color:#6B7280;">
                Hei, <strong style="color:#1F2937;">{{ $name }}</strong>! Kami menerima permintaan untuk mereset password akunmu.
              </p>
            </div>

            <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 28px;">

            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Klik tombol di bawah ini untuk membuat password baru. Link ini hanya berlaku selama <strong>60 menit</strong>.
            </p>

            {{-- CTA --}}
            <div style="text-align:center;margin-bottom:28px;">
              <a href="{{ $url }}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#EC4899);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.3px;">
                Reset Password Sekarang →
              </a>
            </div>

            {{-- Warning --}}
            <div style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;padding:16px;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#92400E;">⚠️ Jika kamu tidak meminta reset password, abaikan email ini. Akunmu tetap aman.</p>
            </div>

            {{-- Link fallback --}}
            <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
              Jika tombol tidak berfungsi, salin link berikut ke browser:<br>
              <a href="{{ $url }}" style="color:#7C3AED;word-break:break-all;">{{ $url }}</a>
            </p>

          </td>
        </tr>

        {{-- Footer --}}
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#9CA3AF;">Email ini dikirim otomatis oleh sistem OshiMerch. Jangan membalas email ini.</p>
            <p style="margin:10px 0 0;font-size:13px;">
              <a href="https://oshimerch.store" style="color:#7C3AED;text-decoration:none;font-weight:600;">oshimerch.store</a>
              &nbsp;·&nbsp;
              <a href="mailto:adminoshimerch@oshimerch.store" style="color:#7C3AED;text-decoration:none;">Hubungi Kami</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
