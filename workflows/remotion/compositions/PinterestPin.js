import { Composition } from 'remotion';

// Pinterest Pin Template
// 1000x1500px vertical pin for discovery

export const PinterestPin = ({
  profileImage = '/profile-A.png',
  quote = 'Default quote text',
  profileName = 'The Quiet Authority',
  profileType = 'Your Profile',
}) => {
  return (
    <div style={{
      width: '1000px',
      height: '1500px',
      backgroundColor: '#0d0d0d',
      color: '#e0dace',
      fontFamily: 'Cormorant Garamond, serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top: Profile Image (40%) */}
      <div style={{
        height: '40%',
        backgroundColor: '#111111',
        backgroundImage: `url(${profileImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(100%)',
        position: 'relative',
      }}>
        {/* Overlay gradient for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
        }} />
      </div>

      {/* Middle: Quote (30%) */}
      <div style={{
        height: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#181818',
      }}>
        <p style={{
          fontSize: '1.8rem',
          color: '#C1593C',
          fontStyle: 'italic',
          lineHeight: '1.4',
          margin: 0,
          fontFamily: 'Cinzel, serif',
          fontWeight: 'bold',
        }}>
          &quot;{quote}&quot;
        </p>
      </div>

      {/* Bottom: CTA (30%) */}
      <div style={{
        height: '30%',
        backgroundColor: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center',
        borderTop: '2px solid #272727',
      }}>
        <p style={{
          fontSize: '1.4rem',
          color: '#C9A84C',
          margin: '0 0 15px 0',
          fontWeight: 'bold',
          fontFamily: 'Cinzel, serif',
          letterSpacing: '2px',
        }}>
          {profileName}
        </p>

        <p style={{
          fontSize: '1rem',
          color: '#807870',
          margin: '0 0 20px 0',
        }}>
          {profileType}
        </p>

        <button style={{
          padding: '12px 30px',
          backgroundColor: '#C9A84C',
          color: '#0d0d0d',
          border: 'none',
          fontSize: '0.95rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '0',
          marginBottom: '15px',
          fontFamily: 'Cinzel, sans-serif',
          letterSpacing: '1px',
        }}>
          FIND YOUR PROFILE
        </button>

        <p style={{
          fontSize: '0.85rem',
          color: '#b0a898',
          margin: 0,
        }}>
          sanctuary-grace.com
        </p>
      </div>
    </div>
  );
};

export const pinterestPinComp = new Composition({
  id: 'Pinterest_Pin',
  component: PinterestPin,
  durationInFrames: 1, // Still image
  fps: 30,
  width: 1000,
  height: 1500,
  defaultProps: {
    profileImage: '/profile-A.png',
    quote: 'Your exhaustion is not failure. It is an invitation.',
    profileName: 'The Quiet Authority',
    profileType: 'The Striving Achiever',
  },
});
