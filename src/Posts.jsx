import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, error, isLoading, isFetching } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000, // 2초가되면 화면에 나온 데이터가 오래되었다고 판단하고 다시 받아온다.
      keepPreviousData: true, // 지난 데이터를 유지하기 위해 캐시에 해당 데이터가 유지되려고 한다면 사용한다.
    }
  );

  // if (isFetching) return <h3>fetching in Progress...</h3>;
  // 캐시된 데이터를 표시하면서 배경에서는 데이터의 업데이트여부를 조용히 서버에 확인하고 데이터가 업데이트 된 경우 해당 데이터를 페이지에 보여준다.
  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>알 수 없는 오류!</h3>
        <p>{error.toString()}</p>
      </>
    );

  // isfetching = 비동기 쿼리가 해결되지 않았음을 의미한다.
  // isLoading = 가져오는 상태에 있음을 의미한다. (쿼리함수가 아직 해결되지 않은 것)

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage < 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
