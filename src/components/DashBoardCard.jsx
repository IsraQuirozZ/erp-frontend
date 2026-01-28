import "./dashboardCard.css";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

function DashboardCard({ title, icon: TopIcon, iconBgColor, data, stats }) {
  // TODO: USE REAL BBDD STATS
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__top">
        <h5>{title}</h5>
        <TopIcon
          size={30}
          className="dashboard-card__top-icon"
          style={{
            backgroundColor: iconBgColor,
          }}
        />
      </div>
      <h2 className="dashboard-card__data">{data}</h2>
      <div className="stadistics">
        {stats >= 0 ? (
          <FaArrowTrendUp size={20} className={"stadistics-icon positive"} />
        ) : (
          <FaArrowTrendDown size={20} className={"stadistics-icon negative"} />
        )}
        <h5
          className={`stadistics-data ${stats >= 0 ? "positive" : "negative"}`}
        >
          {stats >= 0 ? "+" : ""}
          {stats}%
        </h5>
      </div>
      <small>vs last month</small>
    </div>
  );
}

export default DashboardCard;
