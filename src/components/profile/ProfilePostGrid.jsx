import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserUploads } from '../../store/userUploadsSlice'
import UploadedPostList from './UploadedPostList'

function ProfilePostGrid({ onOpenPost }) {
  const dispatch = useDispatch()
  const { error, items: uploadedPosts, status } = useSelector((state) => state.userUploads)

  useEffect(() => {
    dispatch(fetchUserUploads())
  }, [dispatch])

  if (status === 'loading') {
    return (
      <section className="rounded-[22px] bg-white p-4 text-sm font-bold text-[#667085]" aria-label="Profile posts">
        Loading your posts...
      </section>
    )
  }

  if (status === 'failed') {
    return (
      <section className="rounded-[22px] bg-white p-4 text-sm font-bold text-[#c5222f]" aria-label="Profile posts">
        {error || 'Unable to load uploaded posts'}
      </section>
    )
  }

  return (
    <UploadedPostList
      emptyText="Your uploaded photo and video news will show here."
      onOpenPost={onOpenPost}
      onPostChanged={() => dispatch(fetchUserUploads())}
      posts={uploadedPosts}
    />
  )
}

export default ProfilePostGrid
