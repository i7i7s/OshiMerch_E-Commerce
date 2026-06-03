@php
    $txn     = $transaction;
    $listing = $txn->listing;
    $url     = url('/transactions/' . $txn->uuid);
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Barangmu Sudah Dikirim – OshiMerch</title>
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
              <div style="display:inline-block;background:#DBEAFE;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;text-align:center;">🚚</div>
              <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#1F2937;">Barangmu Sudah Dikirim!</h1>
              <p style="margin:0;font-size:15px;color:#6B7280;">
                Paket oshimu sedang dalam perjalanan menuju rumahmu 🎁
              </p>
            </div>

            <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 28px;">

            {{-- Item --}}
            <div style="background:#F9FAFB;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1F2937;">{{ $listing->title }}</p>
              <p style="margin:0;font-size:14px;color:#6B7280;">{{ $listing->featured_member_name ?? $listing->category }}</p>
            </div>

            {{-- Tracking --}}
            <div style="background:linear-gradient(135deg,#EDE9FE,#FCE7F3);border-radius:12px;padding:24px;margin-bottom:28px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#7C3AED;text-transform:uppercase;letter-spacing:0.5px;">📍 Nomor Tracking OshiGo</p>
              <p style="margin:0;font-size:26px;font-weight:800;color:#5B21B6;letter-spacing:2px;">{{ $txn->oshigo_tracking_number }}</p>
              <p style="margin:10px 0 0;font-size:13px;color:#8B5CF6;">Gunakan kode ini untuk melacak paketmu secara real-time</p>
            </div>

            {{-- Progress indicator --}}
            <div style="margin-bottom:28px;">
              <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Status Pengiriman</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;width:25%;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#7C3AED;line-height:32px;font-size:14px;color:#fff;margin:0 auto;">✓</div>
                    <p style="margin:6px 0 0;font-size:11px;color:#7C3AED;font-weight:600;">Dibayar</p>
                  </td>
                  <td style="border-top:2px solid #7C3AED;"></td>
                  <td style="text-align:center;width:25%;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#7C3AED;line-height:32px;font-size:14px;color:#fff;margin:0 auto;">✓</div>
                    <p style="margin:6px 0 0;font-size:11px;color:#7C3AED;font-weight:600;">Dikonfirmasi</p>
                  </td>
                  <td style="border-top:2px solid #7C3AED;"></td>
                  <td style="text-align:center;width:25%;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#7C3AED;line-height:32px;font-size:14px;color:#fff;margin:0 auto;">✓</div>
                    <p style="margin:6px 0 0;font-size:11px;color:#7C3AED;font-weight:600;">Dipacking</p>
                  </td>
                  <td style="border-top:2px solid #EC4899;"></td>
                  <td style="text-align:center;width:25%;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#EC4899;line-height:32px;font-size:14px;color:#fff;margin:0 auto;">🚚</div>
                    <p style="margin:6px 0 0;font-size:11px;color:#EC4899;font-weight:600;">Dikirim</p>
                  </td>
                </tr>
              </table>
            </div>

            {{-- CTA --}}
            <div style="text-align:center;">
              <a href="{{ $url }}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#EC4899);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.3px;">
                Lacak Pesananku →
              </a>
            </div>

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
