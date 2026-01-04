
function ActionOrder({ product }) {
    return (
        <div>
            <button className="btn btn-success btn-sm"
                onClick={() => alert(`Zamówiono ${product.nazwa}`)}
            >Zamów</button>
        </div>
    )
}
export default ActionOrder;