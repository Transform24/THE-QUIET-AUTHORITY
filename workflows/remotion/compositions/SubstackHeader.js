import { Composition } from 'remotion';

// Substack Header Image Template
// 1200x630px header for newsletter

export const SubstackHeader = ({ title = 'Daily Devotion', scripture = '' }) => {
  return (
    <div style={{
      width: '1200px',
      height: '630px',
      backgroundColor: '#0d0d0d',
      backgroundImage: 'radial-gradient(circle at top right, rgba(193, 89, 60, 0.1), transparent)',
      color: '#e0dace',
      fontFamily: 'Cormorant Garamond, serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left border accent */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '8px',
        backgroundColor: '#C9A84C',
      }} />

      {/* Main content */}
      <h1 style={{
        fontSize: '3rem',
        color: '#C1593C',
        marginBottom: '20px',
        fontWeight: 'normal',
        letterSpacing: '2px',
      }}>
        {title}
      </h1>

      {scripture && (
        <p style={{
          fontSize: '1.2rem',
          color: '#C9A84C',
          fontStyle: 'italic',
          marginBottom: '20px',
        }}>
          {scripture}
        </p>
      )}

      {/* Logo/brand */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #272727',
      }}>
        <p style={{
          fontSize: '1rem',
          color: '#807870',
          letterSpacing: '3px',
        }}>
          THE QUIET AUTHORITY
        </p>
      </div>
    </div>
  );
};

export const substackHeaderComp = new Composition({
  id: 'Substack_Header',
  component: SubstackHeader,
  durationInFrames: 1, // Still image
  fps: 30,
  width: 1200,
  height: 630,
  defaultProps: {
    title: 'Daily Devotion',
    scripture: 'Come to me, all you who are weary...',
  },
});
