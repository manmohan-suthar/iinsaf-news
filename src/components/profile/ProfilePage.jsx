import ProfileHeader from './ProfileHeader'
import ProfilePostGrid from './ProfilePostGrid'
import ProfileTabs from './ProfileTabs'

function ProfilePage() {
  return (
    <section className="space-y-4 pb-4" aria-label="Profile page">
      <ProfileHeader />
      <ProfileTabs />
      <ProfilePostGrid />
    </section>
  )
}

export default ProfilePage
