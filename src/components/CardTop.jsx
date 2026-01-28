import "./cardTop.css";

// TODO: ADD REAL STATS TO TOP CLIENTS,PRODUCTS... && ONCLICK
function CardTop({ title, icon: Icon, iconBgColor }) {
  return (
    <div className="card-top">
      <div className="card-top__top">
        <h5>{title}</h5>
        <Icon
          size={30}
          className="card-top__top-icon"
          style={{
            backgroundColor: iconBgColor,
          }}
        />
      </div>
      <table className="card-top__table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Purchases</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="name-cell">
                <span className="name">Amanda Torres</span>
              </div>
            </td>
            <td>10</td>
            <td>1000€</td>
          </tr>

          <tr>
            <td>
              <div className="name-cell">
                <span className="name">Luis Sánchez</span>
              </div>
            </td>
            <td>11</td>
            <td>950€</td>
          </tr>

          <tr>
            <td>
              <div className="name-cell">
                <span className="name">Laura Martinez</span>
              </div>
            </td>
            <td>5</td>
            <td>700€</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CardTop;
