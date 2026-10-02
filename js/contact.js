
  // Your Firebase Config 
  const firebaseConfig = {
    apiKey: "AIzaSyBrQoj7Cd29chXib1kX0cx7Yj7HaXp0IaA",
    authDomain: "itwallah-984aa.firebaseapp.com",
    projectId: "itwallah-984aa"
  };

  //  Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //  Initialize Firestore
  const db = firebase.firestore();

  //  Form Submit Event
  document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get values
    const firstName = document.querySelector("[name='firstName']").value;
    const lastName = document.querySelector("[name='lastName']").value;
    const email = document.querySelector("[name='email']").value;
    const mobile = document.querySelector("[name='mobile']").value;
    const message = document.querySelector("[name='message']").value;

    // Store in Firestore
    db.collection("contacts").add({
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      message: message,
      createdAt: new Date()
    })
    .then(() => {
      alert(" Message sent successfully!");
      document.getElementById("contactForm").reset();
    })
    .catch((error) => {
      alert(" Error: " + error.message);
    });
  });
