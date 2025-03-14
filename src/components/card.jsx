import "../css/card.css";

function Card({ title, imageUrl, description, release_date }) {
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }

    const maxTitleLength = 30;

    return (
        <div className="card">
            <div className="containerCard">
                <div className="imgBlock">
                    <img src={imageUrl} alt={title} />
                </div>
                <div className="contentBlock">
                    <p className="title">
                        <b>Название:</b> {truncateText(title, maxTitleLength)}
                    </p>
                    <p className="description">
                        <b>Описание:</b> {description}
                    </p>
                    <p className="">
                        <b>Дата-релиза:</b> {release_date}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Card;