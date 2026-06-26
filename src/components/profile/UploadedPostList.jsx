import { useState } from 'react'
import { Edit3, Image, MapPin, MoreVertical, Play, Trash2, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { apiAssetUrl } from '../../store/apiClient'
import { deleteUploadedPost, updateUploadedPost } from '../../store/uploadedNewsApi'

function UploadedPostList({ emptyText, onOpenPost, onPostChanged, posts }) {
  const { user } = useSelector((state) => state.auth)
  const [openMenuId, setOpenMenuId] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [editForm, setEditForm] = useState({
    description: '',
    location: '',
    tag: '',
    title: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function openEdit(post) {
    setEditingPost(post)
    setEditForm({
      description: post.description || '',
      location: post.location || '',
      tag: post.tag || '',
      title: post.title || '',
    })
    setOpenMenuId('')
    setError('')
  }

  async function handleEditSubmit(event) {
    event.preventDefault()

    if (!editingPost) {
      return
    }

    setStatus('saving')
    setError('')

    try {
      await updateUploadedPost(editingPost.id, editForm)
      setEditingPost(null)
      onPostChanged?.()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setStatus('idle')
    }
  }

  async function handleDelete(post) {
    if (!window.confirm('Delete this news post?')) {
      setOpenMenuId('')
      return
    }

    setStatus('deleting')
    setError('')

    try {
      await deleteUploadedPost(post.id)
      setOpenMenuId('')
      onPostChanged?.()
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setStatus('idle')
    }
  }

  if (!posts.length) {
    return (
      <section className="rounded-[22px] bg-white p-5 text-center" aria-label="Profile posts">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f5e8df] text-[#c5222f]">
          <Image aria-hidden="true" size={22} strokeWidth={2.5} />
        </div>
        <h2 className="mt-3 text-base font-black text-[#111827]">No uploaded news yet</h2>
        <p className="mt-1 text-sm font-semibold text-[#667085]">{emptyText}</p>
      </section>
    )
  }

  return (
    <section className="grid gap-3" aria-label="Profile posts">
      {posts.map((post) => {
        const primaryMedia = post.media?.[0]
        const isVideo = primaryMedia?.type === 'video'
        const canManagePost = Boolean(user?.id && post.userId === user.id)

        return (
          <article className="relative rounded-[22px] bg-white p-2.5" key={post.id}>
            <div
              className="grid cursor-pointer grid-cols-[104px_1fr] gap-3 text-left"
              onClick={() => onOpenPost?.(post.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenPost?.(post.id)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#111827]">
                {primaryMedia ? (
                  isVideo ? (
                    <video className="h-full w-full object-cover" muted playsInline preload="metadata">
                      <source src={apiAssetUrl(primaryMedia.url)} type="video/mp4" />
                    </video>
                  ) : (
                    <img alt="" className="h-full w-full object-cover" src={apiAssetUrl(primaryMedia.url)} />
                  )
                ) : (
                  <div className="grid h-full w-full place-items-center text-white">
                    <Image aria-hidden="true" size={24} strokeWidth={2.5} />
                  </div>
                )}

                {isVideo ? (
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white">
                    <Play aria-hidden="true" fill="currentColor" size={13} strokeWidth={2.4} />
                  </span>
                ) : null}

                {post.media?.length > 1 ? (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-black text-white">
                    +{post.media.length - 1}
                  </span>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-col justify-center pr-9">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-[#f5e8df] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#c5222f]">
                    {post.tag}
                  </span>
                  <span className="flex min-w-0 items-center gap-1 text-xs font-bold text-[#667085]">
                    <MapPin aria-hidden="true" size={12} strokeWidth={2.5} />
                    <span className="truncate">{post.location}</span>
                  </span>
                </div>
                <h3 className="truncate text-base font-extrabold text-[#111827]">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#667085]">{post.description}</p>
              </div>
            </div>

            {canManagePost ? (
              <div className="absolute right-3 top-3">
                <button
                  aria-label="Post actions"
                  className="grid h-9 w-9 place-items-center rounded-2xl bg-white/95 text-[#111827] shadow-[0_4px_16px_rgba(17,24,39,0.12)]"
                  onClick={() => setOpenMenuId((current) => (current === post.id ? '' : post.id))}
                  type="button"
                >
                  <MoreVertical aria-hidden="true" size={18} strokeWidth={2.5} />
                </button>
                {openMenuId === post.id ? (
                  <div className="absolute right-0 top-10 z-40 grid w-36 overflow-hidden rounded-2xl bg-white text-sm font-extrabold text-[#111827] shadow-xl">
                    <button className="flex items-center gap-2 px-3 py-3 text-left" onClick={() => openEdit(post)} type="button">
                      <Edit3 aria-hidden="true" size={15} strokeWidth={2.5} />
                      Edit
                    </button>
                    <button className="flex items-center gap-2 px-3 py-3 text-left text-[#c5222f]" disabled={status === 'deleting'} onClick={() => handleDelete(post)} type="button">
                      <Trash2 aria-hidden="true" size={15} strokeWidth={2.5} />
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}

      {error ? <p className="rounded-2xl bg-white p-3 text-sm font-bold text-[#c5222f]">{error}</p> : null}

      {editingPost ? (
        <section className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4" aria-label="Edit news post">
          <form className="w-full max-w-sm rounded-[28px] bg-white p-4 shadow-2xl" onSubmit={handleEditSubmit}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#111827]">Edit news post</h2>
              <button
                aria-label="Close edit post"
                className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
                onClick={() => setEditingPost(null)}
                type="button"
              >
                <X aria-hidden="true" size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <input
                className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Title"
                value={editForm.title}
              />
              <textarea
                className="min-h-28 resize-none rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 py-2 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                value={editForm.description}
              />
              <input
                className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, tag: event.target.value }))}
                placeholder="Category / tag"
                value={editForm.tag}
              />
              <input
                className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, location: event.target.value }))}
                placeholder="Location"
                value={editForm.location}
              />
            </div>

            <button
              className="mt-4 min-h-12 w-full rounded-2xl bg-[#c5222f] px-4 text-sm font-black text-white disabled:bg-[#d8d2c8]"
              disabled={status === 'saving'}
              type="submit"
            >
              {status === 'saving' ? 'Saving...' : 'Save post'}
            </button>
          </form>
        </section>
      ) : null}
    </section>
  )
}

export default UploadedPostList
