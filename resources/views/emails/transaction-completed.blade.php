@php
    $txn     = $transaction;
    $listing = $txn->listing;
    $buyer   = $txn->buyer;
    $url     = url('/transactions/' . $txn->uuid);
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Transaksi Selesai – OshiMerch</title>
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
              <div style="display:inline-block;background:#D1FAE5;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;text-align:center;">🎉</div>
              <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#1F2937;">Transaksi Berhasil!</h1>
              <p style="margin:0;font-size:15px;color:#6B7280;">
                <strong style="color:#1F2937;">{{ $buyer->name }}</strong> telah mengkonfirmasi penerimaan paket. Dana akan segera cair!
              </p>
            </div>

            <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 28px;">

            {{-- Summary --}}
            <div style="background:#F9FAFB;border-radius:12px;padding:20px;margin-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;color:#6B7280;padding-bottom:10px;">Item Terjual</td>
                  <td style="font-size:14px;color:#1F2937;font-weight:600;text-align:right;padding-bottom:10px;">{{ $listing->title }}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#6B7280;padding-bottom:10px;">Pembeli</td>
                  <td style="font-size:14px;color:#1F2937;text-align:right;padding-bottom:10px;">{{ $buyer->name }}</td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top:1px solid #E5E7EB;padding-top:10px;"></td>
                </tr>
                <tr>
                  <td style="font-size:15px;font-weight:700;color:#1F2937;padding-top:4px;">Pendapatan</td>
                  <td style="font-size:15px;font-weight:700;color:#10B981;text-align:right;padding-top:4px;">Rp {{ number_format($txn->item_price, 0, ',', '.') }}</td>
                </tr>
              </table>
            </div>

            {{-- Celebration --}}
            <div style="background:linear-gradient(135deg,#EDE9FE,#FCE7F3);border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;">
              <p style="margin:0;font-size:15px;color:#5B21B6;font-weight:600;">✨ Terima kasih sudah berjualan di OshiMerch!</p>
              <p style="margin:8px 0 0;font-size:14px;color:#8B5CF6;">Oshimu bangga padamu 💜</p>
            </div>

            {{-- CTA --}}
            <div style="text-align:center;">
              <a href="{{ $url }}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#EC4899);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.3px;">
                Lihat Detail Transaksi →
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
