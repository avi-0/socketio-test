export default function CopyLinkButton() {
    function copyLink() {
        if (navigator.clipboard) {
            const url = location.origin + location.pathname;
            navigator.clipboard.writeText(url);
        }
    }

    return (
        <button className="btn btn-primary btn-sm" onClick={() => copyLink()}>
            <i className="bi bi-clipboard"></i> Copy link
        </button>
    )
}
