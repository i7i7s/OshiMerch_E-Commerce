@php
    $txn      = $transaction;
    $listing  = $txn->listing;
    $stars    = $rating;
    $url      = url('/transactions/' . $txn->uuid);
    $seller   = $txn->seller;
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ulasan Baru – OshiMerch</title>
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
              <div style="display:inline-block;background:#FEF3C7;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;text-align:center;">⭐</div>
              <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#1F2937;">Ulasan Baru Masuk!</h1>
              <p style="margin:0;font-size:15px;color:#6B7280;">
                <strong style="color:#1F2937;">{{ $reviewerName }}</strong> telah memberikan ulasan untuk transaksimu.
              </p>
            </div>

            <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 28px;">

            {{-- Rating stars --}}
            <div style="text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Rating</p>
              <p style="margin:0;font-size:36px;letter-spacing:4px;">
                @for($i = 1; $i <= 5; $i++)
                  @if($i <= $stars)⭐@else☆@endif
                @endfor
              </p>
              <p style="margin:6px 0 0;font-size:14px;font-weight:700;color:#7C3AED;">{{ $stars }}/5</p>
            </div>

            {{-- Comment --}}
            @if($comment)
            <div style="background:#F9FAFB;border-left:4px solid #7C3AED;border-radius:0 12px 12px 0;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Komentar</p>
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;font-style:italic;">"{{ $comment }}"</p>
            </div>
            @endif

            {{-- Item --}}
            <div style="background:#F9FAFB;border-radius:12px;padding:20px;margin-bottom:28px;">
              <p style="margin:0 0 4px;font-size:13px;color:#9CA3AF;">Item yang diulas</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#1F2937;">{{ $listing->title }}</p>
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
