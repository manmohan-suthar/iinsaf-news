import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPublicProfile } from '../../store/publicProfileSlice'
import PublicProfileHeader from './PublicProfileHeader'
import ProfileTabs from './ProfileTabs'
import UploadedPostList from './UploadedPostList'

function PublicUserProfilePage({ onBack, onOpenPost, userId }) {
  const dispatch = useDispatch()
  const { error, follow, items, profile, status, total } = useSelector((state) => state.publicProfile)

  useEffect(() => {
    if (userId) {
      dispatch(fetchPublicProfile(userId))
    }
  }, [dispatch, userId])

  if (status === 'loading' || status === 'idle') {
    return (
      <section className="space-y-4 pb-4" aria-label="Public profile page">
        <section className="rounded-[28px] bg-white p-4 text-sm font-bold text-[#667085]">Loading profile...</section>
      </section>
    )
  }

  if (status === 'failed' || !profile) {
    return (
      <section className="space-y-4 pb-4" aria-label="Public profile page">
        <section className="rounded-[28px] bg-white p-4">
          <button className="mb-3 text-sm font-extrabold text-[#c5222f]" onClick={onBack} type="button">
            Back
          </button>
          <p className="text-sm font-bold text-[#c5222f]">{error || 'Unable to load profile'}</p>
        </section>
      </section>
    )
  }

  return (
    <section className="space-y-4 pb-4" aria-label="Public profile page">
      <PublicProfileHeader follow={follow} onBack={onBack} profile={profile} totalPosts={total} />
      <ProfileTabs />
      <UploadedPostList
        emptyText={`${profile.name}'s uploaded photo and video news will show here.`}
        onOpenPost={onOpenPost}
        onPostChanged={() => dispatch(fetchPublicProfile(userId))}
        posts={items}
      />
    </section>
  )
}

export default PublicUserProfilePage
