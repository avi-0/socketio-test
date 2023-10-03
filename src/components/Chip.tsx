import { ReactNode } from "react"

export default function Chip({ children }: {
    children?: ReactNode,
}) {
    return (
        <div className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis">
            {children}
        </div>
    )
}
