export default function Footer({ bgColor }) {
  return (
    <footer
      className={`grid place-items-center p-2 text-white text-lg ${bgColor}`}>
      <p>Copyright &copy; 2023 ConfPlus</p>
    </footer>
  );
}
