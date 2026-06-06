import { Composition } from 'remotion';

// YouTube Teaching Video Template
// 12-minute long-form video with opening stillness, teaching, and CTA

export const YouTubeVideo = () => {
  const fps = 30;
  const durationInSeconds = 720; // 12 minutes

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0d0d0d',
      color: '#e0dace',
      fontFamily: 'Jost, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
    }}>
      {/* Opening Stillness (0-30s): Music + breathing guide */}
      <StillnessSegment />

      {/* Teaching (30s-11m): Text-based teaching on background */}
      <TeachingSegment />

      {/* CTA (11m-12m): Gold text invitation */}
      <CTASegment />
    </div>
  );
};

function StillnessSegment() {
  return (
    <div style={{
      textAlign: 'center',
      opacity: 0.8,
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        Begin in Stillness
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#C9A84C' }}>
        Breathe. Listen. Be present.
      </p>
      <p style={{ fontSize: '1rem', marginTop: '40px', color: '#807870' }}>
        30 seconds of silence to settle your heart
      </p>
    </div>
  );
}

function TeachingSegment() {
  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '800px',
    }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#C1593C' }}>
        Your Profile Teaching
      </h2>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
        [Teaching content from agent script will render here]
      </p>
      <blockquote style={{
        marginTop: '40px',
        padding: '20px',
        borderLeft: '4px solid #C9A84C',
        fontStyle: 'italic',
        color: '#b0a898',
      }}>
        [Scripture reference from script]
      </blockquote>
    </div>
  );
}

function CTASegment() {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '40px',
    }}>
      <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: '#C9A84C' }}>
        Next Steps
      </h3>
      <p style={{ fontSize: '1.2rem' }}>
        Take the free assessment: sanctuary-grace.com
      </p>
      <p style={{ fontSize: '0.9rem', marginTop: '20px', color: '#807870' }}>
        Join the Circle of Silence waitlist for daily guided practice
      </p>
    </div>
  );
}

// Remotion Composition metadata
export const youtubeVideoComp = new Composition({
  id: 'YouTube_Teaching_Video',
  component: YouTubeVideo,
  durationInFrames: 720 * 30, // 12 minutes at 30fps
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: {},
});
