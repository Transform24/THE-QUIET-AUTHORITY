import { Composition } from 'remotion';

// Instagram Reel Template
// 60-second short-form video with hook, teaching, and CTA

export const InstagramReel = () => {
  const fps = 30;
  const durationInSeconds = 60;

  return (
    <div style={{
      width: '1080px',
      height: '1920px',
      backgroundColor: '#0d0d0d',
      color: '#e0dace',
      fontFamily: 'Jost, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px',
      position: 'relative',
    }}>
      {/* Hook (0-10s): Eye-catching opener */}
      <HookSegment />

      {/* Teaching (10-45s): Core message */}
      <TeachingSegment />

      {/* CTA (45-60s): Call to action + link */}
      <CTASegment />
    </div>
  );
};

function HookSegment() {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '60px',
    }}>
      <h1 style={{
        fontSize: '4rem',
        color: '#C1593C',
        marginBottom: '20px',
        fontWeight: 'bold',
      }}>
        Wait.
      </h1>
      <p style={{
        fontSize: '2rem',
        color: '#C9A84C',
        lineHeight: '1.4',
      }}>
        Your exhaustion is not failure
      </p>
    </div>
  );
}

function TeachingSegment() {
  return (
    <div style={{
      textAlign: 'center',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <p style={{
        fontSize: '2rem',
        lineHeight: '1.6',
        color: '#e0dace',
        marginBottom: '40px',
      }}>
        [Teaching message from script]
      </p>
      <p style={{
        fontSize: '1.5rem',
        color: '#b0a898',
        fontStyle: 'italic',
      }}>
        [Related scripture or quote]
      </p>
    </div>
  );
}

function CTASegment() {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '60px',
    }}>
      <p style={{
        fontSize: '1.8rem',
        color: '#C9A84C',
        marginBottom: '30px',
      }}>
        Find your profile
      </p>
      <p style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#e0dace',
      }}>
        sanctuary-grace.com
      </p>
    </div>
  );
}

export const instagramReelComp = new Composition({
  id: 'Instagram_Reel',
  component: InstagramReel,
  durationInFrames: 60 * 30, // 60 seconds at 30fps
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: {},
});
