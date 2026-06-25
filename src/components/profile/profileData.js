import video1 from '../../assets/videos/video1.mp4'
import video2 from '../../assets/videos/video2.mp4'
import video3 from '../../assets/videos/video3.mp4'

export const profile = {
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Ramesh%20Kumar&initials=RM&backgroundColor=f5e8df&fontWeight=800',
  name: 'Ramesh Kumar',
  username: '@ramesh.local',
  bio: 'आपके शहर की छोटी-बड़ी खबरें, लोकल अपडेट्स और ग्राउंड रिपोर्ट एक जगह।',
  stats: [
    { label: 'Posts', value: '128' },
    { label: 'Followers', value: '24.8K' },
    { label: 'Following', value: '42' },
  ],
}

export const profileTabs = ['Posts', 'Tagged', 'Repost']

export const profilePosts = [
  { title: 'Ramesh की लोकल रिपोर्ट', video: video1 },
  { title: 'Ram Pratap का शहर अपडेट', video: video2 },
  { title: 'Suresh की ग्राउंड रिपोर्ट', video: video3 },
  { title: 'Mahesh का सिटी न्यूज़', video: video1 },
  { title: 'Naresh का टेक अपडेट', video: video2 },
  { title: 'Dinesh की ब्रेकिंग खबर', video: video3 },
]
