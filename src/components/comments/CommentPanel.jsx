import { useEffect, useRef, useState } from "react";
import { ArrowDown, CornerDownRight, MessageCircle, Send, X } from "lucide-react";
import { addComment, fetchComments } from "../../store/engagementApi";
import { apiAssetUrl } from "../../store/apiClient";

function CommentPanel({ commentsCount, isOpen, newsId, onClose, onCommentAdded, onOpenProfile }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const commentInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    setStatus("loading");
    setError("");

    fetchComments(newsId)
      .then((items) => {
        if (isMounted) {
          setComments(items);
          setStatus("succeeded");
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError.message);
          setStatus("failed");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [newsId]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      commentInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isOpen, newsId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    setStatus("saving");
    setError("");

    try {
      const result = await addComment(newsId, commentText, replyTo?.id);

      if (replyTo?.id) {
        setComments((currentComments) =>
          currentComments.map((comment) =>
            comment.id === replyTo.id
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), result.comment],
                }
              : comment,
          ),
        );
      } else {
        setComments((currentComments) => [result.comment, ...currentComments]);
      }

      setCommentText("");
      setReplyTo(null);
      setStatus("succeeded");
      onCommentAdded?.(result.engagement);
    } catch (submitError) {
      setError(submitError.message);
      setStatus("failed");
    }
  }

  function startReply(comment) {
    setReplyTo({
      id: comment.id,
      name: comment.user.name,
      username: comment.user.username,
    });
    window.setTimeout(() => commentInputRef.current?.focus(), 0);
  }

  return (
    <div
      className={`absolute inset-0 z-[70] bg-black/0 transition-colors duration-300 ${isOpen ? "bg-black/35" : "bg-black/0"}`}
      onClick={onClose}
      role="presentation"
    >
      <section
        className={`absolute inset-x-0 bottom-0 flex max-h-[82%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl transition-transform duration-300 ease-out sm:left-1/2 sm:bottom-4 sm:max-h-[86%] sm:w-[min(100%-2rem,44rem)] sm:-translate-x-1/2 sm:rounded-3xl ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        aria-label="Comments"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#ece7de] bg-[#fbfbf8]/95 px-4 py-3 backdrop-blur sm:px-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#f5e8df] text-[#c5222f]">
              <MessageCircle aria-hidden="true" size={18} strokeWidth={2.5} />
            </span>
            <div>
              <h4 className="text-sm font-black text-[#111827]">Comments</h4>
              <p className="text-xs font-bold text-[#667085]">{commentsCount || comments.length} old comments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Collapse comments"
              className="hidden h-10 items-center gap-2 rounded-full bg-[#f3f1ec] px-3 text-sm font-extrabold text-[#111827] sm:inline-flex"
              onClick={onClose}
              type="button"
            >
              <ArrowDown aria-hidden="true" size={16} strokeWidth={2.5} />
              Back
            </button>
            <button
              aria-label="Close comments"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.18)]"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f8f6f1] p-3 sm:p-4">
          <div className="grid gap-2">
            {status === "loading" ? (
              <div className="grid gap-2">
                <div className="h-16 animate-pulse rounded-2xl bg-white" />
                <div className="h-16 animate-pulse rounded-2xl bg-white" />
              </div>
            ) : null}
            {status !== "loading" && !comments.length ? (
              <div className="rounded-2xl bg-white px-4 py-5 text-center">
                <p className="text-sm font-black text-[#111827]">No comments yet</p>
                <p className="mt-1 text-xs font-bold text-[#667085]">Be the first to comment on this news.</p>
              </div>
            ) : null}
            {comments.map((comment) => (
              <article className="rounded-2xl bg-white p-3 shadow-[0_6px_18px_rgba(17,24,39,0.04)]" key={comment.id}>
                <div className="flex items-start gap-2.5">
                  <button
                    aria-label={`Open ${comment.user.name} profile`}
                    className="h-9 w-9 shrink-0 rounded-full"
                    onClick={() => onOpenProfile?.(comment.user.id)}
                    type="button"
                  >
                    <img
                      alt=""
                      className="h-full w-full rounded-full object-cover ring-2 ring-[#f5e8df]"
                      src={apiAssetUrl(comment.user.avatarUrl)}
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        className="truncate text-left text-xs font-black text-[#111827]"
                        onClick={() => onOpenProfile?.(comment.user.id)}
                        type="button"
                      >
                        {comment.user.name}
                      </button>
                      <span className="shrink-0 text-[10px] font-bold text-[#98a2b3]">Now</span>
                    </div>
                    <button
                      className="block max-w-full truncate text-left text-[11px] font-bold text-[#667085]"
                      onClick={() => onOpenProfile?.(comment.user.id)}
                      type="button"
                    >
                      {comment.user.username}
                    </button>
                    <p className="mt-1.5 text-sm font-semibold leading-5 text-[#344054]">{comment.text}</p>
                    <button
                      className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#c5222f]"
                      onClick={() => startReply(comment)}
                      type="button"
                    >
                      <CornerDownRight aria-hidden="true" size={13} strokeWidth={2.5} />
                      Reply
                    </button>
                  </div>
                </div>
                {comment.replies?.length ? (
                  <div className="mt-3 grid gap-2 border-l-2 border-[#f5e8df] pl-3">
                    {comment.replies.map((reply) => (
                      <div className="flex items-start gap-2.5 rounded-2xl bg-[#fbfbf8] p-2.5" key={reply.id}>
                        <button
                          aria-label={`Open ${reply.user.name} profile`}
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => onOpenProfile?.(reply.user.id)}
                          type="button"
                        >
                          <img
                            alt=""
                            className="h-full w-full rounded-full object-cover ring-2 ring-white"
                            src={apiAssetUrl(reply.user.avatarUrl)}
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              className="truncate text-left text-xs font-black text-[#111827]"
                              onClick={() => onOpenProfile?.(reply.user.id)}
                              type="button"
                            >
                              {reply.user.name}
                            </button>
                            <span className="shrink-0 text-[10px] font-bold text-[#98a2b3]">Reply</span>
                          </div>
                          <button
                            className="block max-w-full truncate text-left text-[11px] font-bold text-[#667085]"
                            onClick={() => onOpenProfile?.(reply.user.id)}
                            type="button"
                          >
                            {reply.user.username}
                          </button>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#344054]">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-[#ece7de] bg-white shadow-[0_-8px_24px_rgba(17,24,39,0.06)]">
          {replyTo ? (
            <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-4">
              <p className="min-w-0 truncate text-xs font-bold text-[#667085]">
                Replying to <span className="font-black text-[#111827]">{replyTo.name}</span>
              </p>
              <button
                className="shrink-0 text-xs font-black text-[#c5222f]"
                onClick={() => setReplyTo(null)}
                type="button"
              >
                Cancel
              </button>
            </div>
          ) : null}
          <form className="flex gap-2 p-3 sm:p-4" onSubmit={handleSubmit}>
            <input
              autoFocus
              className="min-h-11 min-w-0 flex-1 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-semibold text-[#111827] outline-none focus:border-[#c5222f]"
              maxLength={280}
              ref={commentInputRef}
              onChange={(event) => {
                setCommentText(event.target.value);
                setError("");
              }}
              placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Write a comment..."}
              type="text"
              value={commentText}
            />
            <button
              aria-label={replyTo ? "Post reply" : "Post comment"}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-[#111827] text-white disabled:bg-[#d8d2c8]"
              disabled={status === "saving" || !commentText.trim()}
              type="submit"
            >
              <Send aria-hidden="true" size={18} strokeWidth={2.4} />
            </button>
          </form>
        </div>

        {error ? <p className="px-4 pb-3 text-xs font-bold text-[#c5222f]">{error}</p> : null}
      </section>
    </div>
  );
}

export default CommentPanel;
