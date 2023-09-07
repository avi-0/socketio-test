interface Props {
  id: string;
}

export default function JoinRoom({ id }: Props) {
  return (
    <div className="d-flex h-100 justify-content-center align-items-center bg-body-tertiary">
        <form action={`/room/${id}`}>
            <div className="mb-3">
                <label className="form-label" htmlFor="username">Your name</label>
                <input className="form-control" id="username" name="name" autoComplete="off" required></input>
            </div>
            <button className="btn btn-primary w-100" type="submit">Join room</button>
        </form>
    </div>
  )
}