<footer>
  <div class="footer-container">
    <div class="footer-section">
      <h3>About Us</h3>
      <p>
        We are committed to providing the best service. Our platform ensures
        top-notch solutions for your needs.
      </p>
    </div>

    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h3>Contact Us</h3>
      <p>Email: support@example.com</p>
      <p>Phone: +1 234 567 890</p>
      <p>Address: 123 Main St, City, Country</p>
    </div>

    <div class="footer-section">
      <h3>Follow Us</h3>
      <div class="social-icons">
        <a href="#"><img src="./images/facebook.png" alt="Facebook" /></a>
        <a href="#"><img src="./images/twit.png" alt="Twitter" /></a>
        <a href="#"><img src="./images/link.png" alt="LinkedIn" /></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2024 Your Company. All Rights Reserved.</p>
  </div>
</footer>

<style>
  footer {
    /* Dark background color for contrast */
    color: #000000; /* Light text color for readability */
    padding: 40px 0;
    font-size: 14px;
    position: relative;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: #ecf0f1;
    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.3);
  }

  .footer-container {
    display: flex;
    justify-content: space-between; /* Equal spacing between sections */
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 0 50px;
    max-width: 1200px; /* Max width for better control on larger screens */
    margin: 0 auto;
  }

  .footer-section {
    margin: 20px 0;
    width: 23%; /* Adjust width for better alignment */
  }

  .footer-section h3 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #000000; /* Light color for headings */
    border-bottom: 2px solid #777777; /* Underline with primary color */
    padding-bottom: 10px;
  }

  .footer-section p,
  .footer-section ul,
  .footer-section a {
    color: #000000; /* Softer light color for text */
    margin-bottom: 10px;
    line-height: 1.6;
    text-decoration: none;
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
  }

  .footer-section ul li {
    margin-bottom: 10px;
  }

  .footer-section a:hover {
    color: #3498db; /* Primary color on hover */
    text-decoration: underline;
  }

  .social-icons {
    display: flex;
    gap: 15px;
  }

  .social-icons a img {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
    filter: grayscale(100%); /* Grayscale effect for icons */
  }

  .social-icons a img:hover {
    transform: scale(1.2);
    filter: grayscale(0); /* Remove grayscale on hover */
  }

  .footer-bottom {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #34495e;
    margin-top: 20px;
  }

  .footer-bottom p {
    margin: 0;
    color: #95a5a6; /* Light gray color for footer text */
  }

  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .footer-section {
      width: 100%;
    }
  }
</style>
