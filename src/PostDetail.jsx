import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(
    ["comments", post.id], // 각 게시물의 댓글을 보여주기 위해서는 의존성배열로 post.id값을 주어야 해당 게시물의 댓글이 나오게된다.
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId)); // 함수에 인자 할당이 가능하다.
  const updateMutation = useMutation((postId) => updatePost(postId)); // 원래는 새로운 제목도 인수로 받아야한다. 이 api는 수정하는게 불가함

  if (isLoading) return <h3>Loading...</h3>;

  if (isError)
    return (
      <>
        <h3>Something Wrong!!</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Post has (not) been deleted</p>
      )}
      {updateMutation.isError && (
        <p style={{ color: "red" }}>Error updating the post</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>Updating the post</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>Post has (not) been updated</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
