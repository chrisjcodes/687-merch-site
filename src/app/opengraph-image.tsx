import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [vanBuffer, antonBuffer] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/images/van-illustration.png')),
    fetch('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0Kr4A.woff')
      .then((r) => r.arrayBuffer())
      .catch(() => null),
  ]);

  const vanSrc = `data:image/png;base64,${vanBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Anton, sans-serif',
        }}
      >
        {/* Van — right side */}
        <img
          src={vanSrc}
          style={{
            position: 'absolute',
            right: '-2%',
            bottom: 0,
            width: '58%',
            objectFit: 'contain',
            objectPosition: 'right bottom',
          }}
        />

        {/* Left-to-right gradient so text stays readable */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, #0a0a0a 0%, #0a0a0a 40%, rgba(10,10,10,0.6) 58%, transparent 72%)',
            display: 'flex',
          }}
        />

        {/* Text */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          <div
            style={{
              color: '#f2bf00',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 20,
              fontFamily: 'sans-serif',
            }}
          >
            687 MERCH
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              marginBottom: 28,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            YOUR MERCH<br />PARTNER.
          </div>
          <div
            style={{
              color: '#888888',
              fontSize: 22,
              lineHeight: 1.6,
              maxWidth: 420,
              fontFamily: 'sans-serif',
              fontWeight: 400,
            }}
          >
            {"We're not a traditional printer. We're a mobile merch booth."}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: antonBuffer
        ? [{ name: 'Anton', data: antonBuffer, style: 'normal', weight: 400 }]
        : [],
    }
  );
}
