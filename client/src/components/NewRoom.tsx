import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function NewRoom() {
  const id = nanoid(8);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      pathname: `/room/${id}`,
      search: searchParams.toString(),
    }, {
      replace: true,
    })
  }, [])

  return <div>Creating new room...</div>
}
