import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSpinner, faMapMarkerAlt, faHeart, faGlobe } from '@fortawesome/free-solid-svg-icons'

interface UserProfile {
  userId: string;
  username: string;
  avatar: string;
  country: string;
  rank: string;
  countryRank: string;
  pp: string;
  accuracy: string;
  playCount: string;
  playTime: string;
  rankedScore: string;
  totalScore: string;
  level: string;
  totalHits: string;
  maxCombo: string;
  location: string;
  interests: string;
  website: string;
  userpage: string;
  playstyle: string[];
}

interface ProfileViewProps {
  userId: string
  onLog: (message: string) => void
}

export default function ProfileView({ userId, onLog }: ProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) {
      loadProfile()
    }
  }, [userId])

  const loadProfile = async () => {
    setIsLoading(true)
    setError('')
    onLog(`Loading profile for user ${userId}...`)
    
    try {
      const response = await fetch(`https://osu.titanic.sh/u/${userId}`);
      const html = await response.text();
      
      // Parse HTML using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract username
      const usernameEl = doc.querySelector('.profile-username');
      const username = usernameEl?.textContent?.trim() || userId;
      
      // Extract avatar
      const avatarEl = doc.querySelector('.avatar img');
      const avatar = avatarEl?.getAttribute('src') || '';
      const fullAvatar = avatar ? (avatar.startsWith('http') ? avatar : `https://osu.titanic.sh${avatar}`) : '';
      
      // Extract country
      const countryEl = doc.querySelector('.flag img');
      const country = countryEl?.getAttribute('alt') || '';
      
      // Extract performance/rank
      const performanceEl = doc.querySelector('.profile-performance strong');
      const performanceText = performanceEl?.textContent || '';
      const ppMatch = performanceText.match(/(\d+)pp/);
      const pp = ppMatch?.[1] || '0';
      
      const rankMatch = performanceText.match(/\((#\d+)\)/);
      const rank = rankMatch?.[1]?.replace('#', '') || '0';
      
      // Extract country rank
      const performanceContainer = doc.querySelector('.profile-performance');
      const countryRankText = performanceContainer?.textContent || '';
      const countryRankMatch = countryRankText.match(/#(\d+)/);
      const countryRank = countryRankMatch?.[1] || '0';
      
      // Extract detailed stats
      let accuracy = '0%';
      let playCount = '0';
      let playTime = '0h';
      let rankedScore = '0';
      let totalScore = '0';
      let level = '0';
      let totalHits = '0';
      let maxCombo = '0';
      
      const statsElements = doc.querySelectorAll('.profile-stats-element');
      statsElements.forEach((elem) => {
        const text = elem.textContent || '';
        if (text.includes('Hit Accuracy')) {
          const match = text.match(/(\d+\.?\d*)%/);
          accuracy = match?.[1] || '0%';
        } else if (text.includes('Play Count')) {
          const match = text.match(/(\d+)/);
          playCount = match?.[1] || '0';
        } else if (text.includes('Play Time')) {
          const match = text.match(/(\d+\.?\d*\s*[a-z]+)/i);
          playTime = match?.[1] || '0h';
        } else if (text.includes('Ranked Score')) {
          const match = text.match(/([\d,]+)/);
          rankedScore = match?.[1] || '0';
        } else if (text.includes('Total Score')) {
          const match = text.match(/([\d,]+)/);
          totalScore = match?.[1] || '0';
        } else if (text.includes('Current Level')) {
          const match = text.match(/(\d+)/);
          level = match?.[1] || '0';
        } else if (text.includes('Total Hits')) {
          const match = text.match(/([\d,]+)/);
          totalHits = match?.[1] || '0';
        } else if (text.includes('Maximum Combo')) {
          const match = text.match(/(\d+)/);
          maxCombo = match?.[1] || '0';
        }
      });
      
      // Extract location
      let location = '';
      const detailsDivs = doc.querySelectorAll('.profile-details div');
      detailsDivs.forEach((elem) => {
        if (elem.querySelector('.icon-map-marker')) {
          location = elem.querySelector('div')?.textContent?.trim() || '';
        }
      });
      
      // Extract interests
      let interests = '';
      detailsDivs.forEach((elem) => {
        if (elem.querySelector('.icon-heart-empty')) {
          interests = elem.querySelector('div')?.textContent?.trim() || '';
        }
      });
      
      // Extract website
      let website = '';
      detailsDivs.forEach((elem) => {
        if (elem.querySelector('.icon-globe')) {
          website = elem.querySelector('a')?.textContent?.trim() || '';
        }
      });
      
      // Extract playstyle
      const playstyle: string[] = [];
      const playstyleElements = doc.querySelectorAll('.playstyle.playstyle-using');
      playstyleElements.forEach((elem) => {
        const id = elem.getAttribute('id');
        if (id) {
          playstyle.push(id);
        }
      });
      
      // Extract userpage
      const userpageEl = doc.querySelector('.userpage .bbcode');
      const userpage = userpageEl?.innerHTML || '';
      
      setProfile({
        userId,
        username,
        avatar: fullAvatar,
        country,
        rank,
        countryRank,
        pp,
        accuracy,
        playCount,
        playTime,
        rankedScore,
        totalScore,
        level,
        totalHits,
        maxCombo,
        location,
        interests,
        website,
        userpage,
        playstyle
      });
      
      onLog(`Loaded profile for ${username}`);
    } catch (err) {
      setError('Failed to load profile');
      onLog(`Error loading profile: ${err}`);
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '64px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px' 
        }}>
          <div style={{ fontSize: '40px', color: 'var(--viso-accent)' }}>
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
          <p style={{ fontSize: '16px', color: 'var(--viso-text-secondary)' }}>
            Loading profile...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '64px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', color: 'var(--viso-text-muted)' }}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <p style={{ fontSize: '16px', color: 'var(--viso-text-muted)' }}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '64px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', color: 'var(--viso-text-muted)' }}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <p style={{ fontSize: '16px', color: 'var(--viso-text-muted)' }}>
            No user ID set
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex',
        gap: '24px',
        marginBottom: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Avatar */}
        <div style={{ 
          flex: '0 0 auto',
          width: '120px',
          height: '120px'
        }}>
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.username}
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '12px',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '12px',
              background: 'linear-gradient(145deg, var(--viso-accent-dim), var(--viso-accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: 'var(--viso-bg-primary)'
            }}>
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
        </div>

        {/* User Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: 'var(--viso-text-primary)', 
            marginBottom: '8px',
            letterSpacing: '-0.025em'
          }}>
            {profile.username}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--viso-text-secondary)', marginBottom: '12px' }}>
            ID: {profile.userId}
          </p>
          
          {/* Playstyles */}
          {profile.playstyle.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--viso-text-muted)', fontWeight: '600' }}>
                Playstyles:
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {profile.playstyle.map((style, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '4px 12px',
                      background: 'var(--viso-bg-tertiary)',
                      color: 'var(--viso-text-primary)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Global Rank */}
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'linear-gradient(145deg, var(--viso-accent-dim), var(--viso-accent))',
            borderRadius: '20px',
            color: 'var(--viso-bg-primary)',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            Global Rank #{profile.rank}
          </div>
        </div>
      </div>

      {/* Description / Userpage */}
      {profile.userpage && (
        <div style={{ 
          padding: '24px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div 
            style={{ 
              fontSize: '14px', 
              color: 'var(--viso-text-primary)',
              lineHeight: '1.6'
            }}
            onClick={async (e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'A' && target instanceof HTMLAnchorElement) {
                e.preventDefault();
                const href = target.getAttribute('href');
                if (href) {
                  await window.electronAPI.openExternal(href);
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: profile.userpage }}
          />
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Level
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--viso-text-primary)', margin: 0 }}>
            {profile.level}
          </p>
        </div>

        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Maximum Combo
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--viso-text-primary)', margin: 0 }}>
            {profile.maxCombo}
          </p>
        </div>

        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Total Play Time
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--viso-text-primary)', margin: 0 }}>
            {profile.playTime}
          </p>
        </div>

        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Overall Accuracy
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--viso-text-primary)', margin: 0 }}>
            {profile.accuracy}
          </p>
        </div>

        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Playcount
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--viso-text-primary)', margin: 0 }}>
            {profile.playCount}
          </p>
        </div>
      </div>

      {/* Contact/Location Section */}
      {(profile.location || profile.interests || profile.website) && (
        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {profile.location && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px'
              }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--viso-accent)', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', color: 'var(--viso-text-primary)' }}>
                  {profile.location}
                </span>
              </div>
            )}
            {profile.interests && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px'
              }}>
                <FontAwesomeIcon icon={faHeart} style={{ color: 'var(--viso-accent)', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', color: 'var(--viso-text-primary)' }}>
                  {profile.interests}
                </span>
              </div>
            )}
            {profile.website && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px'
              }}>
                <FontAwesomeIcon icon={faGlobe} style={{ color: 'var(--viso-accent)', fontSize: '16px' }} />
                <a 
                  href={profile.website} 
                  onClick={(e) => {
                    e.preventDefault();
                    window.electronAPI.openExternal(profile.website);
                  }}
                  style={{ 
                    fontSize: '14px', 
                    color: 'var(--viso-accent)',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
