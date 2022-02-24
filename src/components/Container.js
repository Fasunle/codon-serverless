const styles = {
  container: {
    margin: "0 auto",
    padding: "50px 100px",
  },
};

const Container = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Container;
