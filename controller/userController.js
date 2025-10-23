import User from "../model/userModel.js";
import nodemailer from "nodemailer";

// 📨 Create a new user and send devotional email

export const create = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const { email, name } = newUser;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const savedUser = await newUser.save();
    // res.status(200).json(savedData);

    // Fetch the latest uploaded PDF
    // const latestPdf = await Pdf.findOne().sort({ createdAt: -1 });

    // if (!latestPdf) {
    //   return res.status(404).json({ message: "No devotional PDF found" });
    // }

    // Construct the full PDF URL (adjust if deployed)
    const pdfLink =  "https://drive.google.com/file/d/1UTqyZ4e_FHHnTNPbWrEykMrrbp6-GENY/view?usp=sharing";


    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const mailOptions = {
      from: `"Wise Mysteries" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Here’s your free 7-Day Devotional ✨",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h2 style="color: #6A0DAD;">Hi ${name},</h2>

          <p>Welcome to <strong>Wise Mysteries!</strong> 🙏</p>
          <p>As promised, here’s your <strong>FREE 7-Day Devotional</strong>:</p>

          <p>
            <a href="${pdfLink}" 
               style="display:inline-block; padding:10px 20px; background:#6A0DAD; color:#fff; border-radius:5px; text-decoration:none; font-weight:bold;">
              📖 Download Your Devotional
            </a>
          </p>

          <p>Each day you’ll discover how God uses struggles to shape us, just like He did with David, Joseph, Esther, and Moses.</p>

          <p>💡 <strong>Quick Tip:</strong> Don’t rush — take just 5–10 minutes each day to read, reflect, and pray.</p>

          <p>I’m honored to walk with you on this journey. Tomorrow I’ll share a story that shows exactly how God turns wilderness seasons into preparation for your destiny.</p>

          <p>Stay encouraged,</p>
          <p><strong>Wise Mysteries</strong><br>
          <span style="color:#6A0DAD;">Wise Mysteries</span></p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "✅ User created successfully and email sent.",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user or sending email:", error);
    res.status(500).json({ errorMessage: error.message });
  }
};

// 📢 Send bulk email to all registered users (Admin use)
export const sendBulkEmail = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}, "email name");
    if (!users.length) {
      return res.status(404).json({ message: "No registered users found." });
    }

    // ✅ External purchase/download link (replace this as needed)
    const purchaseLink = "https://wisemysteries.com/purchase-30-day-devotional";

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const subject = "Ready for the next step? 📖";

    const sendEmail = async (email, name) => {
      const mailOptions = {
        from: `"Wise Mysteries" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #333; background: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h2 style="color: #6A0DAD;">Hi ${name || "Friend"},</h2>

            <p>By now, you’ve seen how powerful the 7-Day Devotional can be. But what if you could go deeper for a full month?</p>

            <p>That’s why I created the <strong>30-Day Wise Mysteries Devotional (E-Book)</strong>. Inside you’ll find:</p>
            <ul>
              <li>✅ Daily scriptures & reflections</li>
              <li>✅ Biblical stories of David, Joseph, Esther, Moses, and Jesus</li>
              <li>✅ Practical steps to apply each lesson in your life</li>
            </ul>

            <p>
              👉 For a limited time, you can get it today for just $19 → 
              <a href="${purchaseLink}" style="color:#6A0DAD; font-weight:bold;">Purchase Here</a>
            </p>

            <p>If the 7 days blessed you, imagine what 30 days will do for your faith and focus.</p>

            <p>Take the next step in your journey,</p>
            <p><strong>Wise Mysteries</strong></p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    };

    // Batch sending (50 emails per batch)
    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.all(batch.map((u) => sendEmail(u.email, u.name)));
      console.log(`✅ Sent batch ${i / batchSize + 1}`);
    }

    res.status(200).json({
      message: `✅ Bulk email successfully sent to ${users.length} users.`,
    });
  } catch (error) {
    console.error("Error sending bulk email:", error);
    res.status(500).json({ errorMessage: error.message });
  }
};