import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  ProfileOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
const styles = {
  title: {
    marginLeft: "5px",
  },
};
const Nav = () => {
  const { pathname } = useLocation();
  const current = pathname.split("/")[1];

  return (
    <div>
      <Menu selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="home">
          <Link to="/home">
            <HomeOutlined />
            <span className={styles.title}>Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link to="/profile">
            <ProfileOutlined />
            <span className={styles.title}>Profile</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="protected">
          <Link to="/protected">
            <FileProtectOutlined />
            <span className={styles.title}>Protected</span>
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Nav;
