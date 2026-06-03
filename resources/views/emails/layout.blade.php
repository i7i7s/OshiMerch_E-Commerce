<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ $slot ?? 'OshiMerch' }}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        {{-- Header --}}
        <tr>
          <td style="background:linear-gradient(135deg,#7C3AED 0%,#EC4899 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
              ⭐ OshiMerch
            </p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">
              Marketplace Merch Idol Terpercaya
            </p>
          </td>
        </tr>

        {{-- Content --}}
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">
            {{ $slot }}
          </td>
        </tr>

        {{-- Footer --}}
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#9CA3AF;">
              Email ini dikirim otomatis oleh sistem OshiMerch.<br>
              Jangan membalas email ini.
            </p>
            <p style="margin:12px 0 0;font-size:13px;color:#9CA3AF;">
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
