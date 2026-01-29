import React from "react";
import { Comment } from "./Comment";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchComments = async (blogId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${blogId}`,
  );
  return res.data;
};

const Comments = ({ blogId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => fetchComments(blogId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${blogId}`,
        newComment,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to post comment";
      toast.error(errorMsg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc")?.trim();

    if (!desc) {
      toast.error("Please write a comment before submitting");
      return;
    }

    mutation.mutate({ desc });
    e.target.reset(); // Clear form after submission
  };

  return (
    <div className="bg-paper border border-soft p-4 sm:p-6 md:p-8 mt-8 mb-10">
      <h2 className="mb-6 sm:mb-8 pb-4 border-b border-soft">Comments</h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="md:mb-4 mb-8">
          <textarea
            name="desc"
            required
            placeholder="Share your thoughts on this article..."
            className="w-full min-h-[120px] p-4 bg-transparent border border-soft text-ink placeholder:text-muted placeholder:italic focus:outline-none focus:border-accent transition-colors resize-y font-serif"
            disabled={mutation.isPending}
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-vintage mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      ) : (
        <div className="md:mb-2 p-4 bg-[var(--bg-main)] border border-soft text-center">
          <p className="text-muted">
            Please{" "}
            <a href="/login" className="accent hover:underline">
              log in
            </a>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {isPending ? (
          <div className="text-center py-8">
            <p className="meta">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted">
              Error loading comments. Please try again later.
            </p>
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center">
            <p className="text-muted italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <>
            {mutation.isPending && (
              <Comment
                comment={{
                  desc: mutation.variables.desc,
                  createdAt: new Date(),
                  user: {
                    username: user.username,
                    img: user.imageUrl,
                  },
                  isPending: true,
                }}
              />
            )}
            {data?.map((comment) => (
              <Comment comment={comment} blogId={blogId} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
