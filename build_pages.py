#!/usr/bin/env python3
"""Generate the Ingenio Care static replica pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def prefix(depth: int) -> str:
    return "" if depth == 0 else "../" * depth


NAV = [
    ("/", "Home"),
    ("/network/", "Network"),
    ("/blogs/", "Blogs"),
    ("/news/", "News"),
    ("/about-us/", "About Us"),
]

MORE = [
    ("/physician-advisory-board/", "Physician Advisory Board"),
    ("/healthcare-advisory-board/", "Healthcare Advisory Board"),
    ("/contact-us/", "Contact Us"),
]


def page(title, depth, active, body, description=None):
    p = prefix(depth)
    desc = description or "Ai Enabled, Patient Centric Digital Health Network"
    nav_html = []
    for href, label in NAV:
        path = href.lstrip("/") or "index.html"
        cls = ' class="active"' if label == active else ""
        nav_html.append(f'<a href="{p}{path}"{cls}>{label}</a>')
    more_html = []
    for href, label in MORE:
        path = href.lstrip("/")
        cls = ' class="active"' if label == active else ""
        more_html.append(f'<a href="{p}{path}"{cls}>{label}</a>')
    more_open = ' open' if active in {label for _, label in MORE} else ""
    return f"""<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#0F2940">
  <link rel="icon" href="{p}assets/images/favicon.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Share:wght@400;700&family=Source+Sans+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{p}css/styles.css">
</head>
<body>
  <div class="banner">
    <a href="https://ingeniocare.ai" target="_blank" rel="noopener">
      <p>Join us at HLTH Conference in Vegas October 19-22. Digital Health booth 1760-46</p>
    </a>
  </div>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="{p}index.html">
        <img src="{p}assets/images/logo.png" alt="Ingenio Care">
        <span>Ingenio Care, Inc.</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false">Menu</button>
      <nav class="nav">
        {''.join(nav_html)}
        <div class="nav-more{more_open}">
          <button type="button">More</button>
          <div class="nav-more-menu">
            {''.join(more_html)}
          </div>
        </div>
        <a class="account-link" href="{p}m/account/">Sign In</a>
      </nav>
    </div>
  </header>
  <main>
{body}
  </main>
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <p>Copyright © 2023 Ingenio Care - All Rights Reserved.</p>
      <p><a href="{p}privacy-policy/">Privacy Policy</a></p>
    </div>
  </footer>
  <aside class="cookie" aria-live="polite">
    <h4>This website uses cookies.</h4>
    <p>We use cookies to analyze website traffic and optimize your website experience. By accepting our use of cookies, your data will be aggregated with all other user data.</p>
    <button class="btn" type="button" data-accept-cookies>Accept</button>
  </aside>
  <script src="{p}js/main.js"></script>
</body>
</html>
"""


def write(rel, html):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    print("wrote", rel)


HOME = r"""
    <section class="hero" style="background-image:url('assets/images/hero.jpg')">
      <div class="wrap hero-inner">
        <p class="kicker">Ai Enabled, Patient Centric Digital Health Network</p>
        <ul>
          <li>Provide Instant Patient Access</li>
          <li>Increase Provider Efficiency</li>
          <li>Seamless Care Coordination</li>
          <li>Continuity of care</li>
          <li>Customized Care Plan</li>
        </ul>
        <h1>Welcome to Ingenio Care</h1>
        <p>Efficient Patient Centric Digital Health Network to Improve Quality of Care While Reducing Cost by Over 25% and Increasing Provider Income.</p>
        <a class="btn light" href="network/">Find out more</a>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h3>News Flash</h3>
        <div class="news-item">
          <a href="7-08-2025-ingenio-care-1/">Advisory Board expands with top clinical and business experts guiding Ingenio Care’s AI-enabled platform for connected, patient-centric care</a>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="wrap grid-2">
        <div>
          <h2>A Patient Centric Digital Health Network</h2>
          <p>We are building an Ai enabled patient centric digital health network to provide personalized care for each patient. The network is built upon our proprietary platform to implement processes that will minimize the administrative burden and seamlessly connect patient to the providers, while enabling plans to monitor and provide oversite on utilization.</p>
          <ul>
            <li>Our platform leverages an AI-enabled Patient Care Orchestration Model (PCOM) to facilitate care delivery when needed, of the type of care needed with a higher quality while reducing cost.</li>
            <li>Our patient access solution optimizes patient-physician engagement making patient access instant by tapping unused provider capacity. The solution seamlessly connects providers to patients over an Ai powered channel which leverages Ai for documentation and delivers real-time suggestions to physicians. We expect our model to reduce cost of care while increasing physician income.</li>
            <li>Eventually our network will create efficiency throughout the care continuum by removing barriers, adoption of best-in-class protocols and patient centric provider incentives.</li>
          </ul>
        </div>
        <div>
          <h4>Our Approach</h4>
          <p><em>Built on an AI-enabled Patient-centric Care Orchestration Model, our solution is designed to:</em></p>
          <ul>
            <li>improve efficiency</li>
            <li>reduce utilization</li>
            <li>reduce average unit price</li>
          </ul>
          <a class="btn" href="contact-us/">Schedule a call</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2 class="center">Serving Our customers, Our Partners</h2>
        <div class="grid-cards" style="margin-top:2rem">
          <article class="card">
            <img src="assets/images/employer.jpg" alt="Self-Insured Employers">
            <div class="card-body">
              <h4>Self-Insured Employers</h4>
              <p>When your colleagues run into a health concern during a busy day, who do they turn to? They do not have easy options. Our healthcare network will provide them an instant virtual consult with the right specialist within the plan who can guide them to efficiently address their concern. No additional cost to the employer or the employee!</p>
            </div>
          </article>
          <article class="card">
            <img src="assets/images/health-plans.jpg" alt="Health Plans">
            <div class="card-body">
              <h4>Health Plans</h4>
              <p>For Health Plans, we create instant virtual visits for members by connecting to a local provider within the network. Once connected, our platform can guide the patient through the plan's network, while the plan provides timely and seamless Ai assisted utilization management.</p>
            </div>
          </article>
          <article class="card">
            <img src="assets/images/health-systems.jpg" alt="Health Systems">
            <div class="card-body">
              <h4>Health Systems</h4>
              <p>Our key solution for health plans is to connect patients with the right provider instantly and efficiently. By using our solution health system can achieve a great capacity utilization and provider efficiency resulting in increased net operating margin. Our end-to-end care model can further deliver higher quality/ cost efficient care with greater value-based reimbursements.</p>
            </div>
          </article>
          <article class="card">
            <img src="assets/images/home-health.jpg" alt="Home Health">
            <div class="card-body">
              <h4>Home Health</h4>
              <p>When in home health setting, patients may often need to talk to a provider with specific questions or to address a symptom. We help home health patients with real-time access to providers who can guide them to the right solution saving potential admission. We are also building an Ai bot powered with patient specific instructions to monitor patient progress and send instant alerts to attending providers, if needed.</p>
            </div>
          </article>
          <article class="card">
            <img src="assets/images/assisted-living.jpg" alt="Assisted Living, SKNF, and Hospice">
            <div class="card-body">
              <h4>Assisted Living/ SKNF/Hospice</h4>
              <p>We work with you to develop care plans for your residents that leverage virtual visits, combined with in-person visits to deliver a high-quality patient experience.</p>
              <p>We support customized care plan with real-time access to specialty care, for example behavior health provider, to address unexpected events. Our model uses nurses available onsite to deliver complete healthcare solution.</p>
            </div>
          </article>
          <article class="card">
            <img src="assets/images/fqhc.png" alt="FQHC">
            <div class="card-body">
              <h4>FQHC</h4>
              <p>When caring for underserved population, finding timely specialist consultation is a challenge. Our network of providers brings a virtual specialist consult to your patient instantly making care coordination a breeze. Our Ai documenter can further improve productivity of your providers.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section navy">
      <div class="wrap grid-2">
        <div>
          <h2>We invite providers to join our network</h2>
          <h4>Take the next step towards a patient centric, higher quality and efficient healthcare network.</h4>
          <ul>
            <li>Receive real-time referrals from our network for patients to expand your panel.</li>
            <li>Ai driven documentation coding and claims processing.</li>
            <li>Ai driven patient care suggestions.</li>
            <li>Seamless outbound and inbound referrals</li>
            <li>Get patient feedback and improve continuity of care.</li>
            <li>And the best thing is that the enrollment is FREE.</li>
          </ul>
          <a class="btn gold" href="https://ingeniocare.ai" target="_blank" rel="noopener">Enroll Today and start getting new patients</a>
        </div>
        <div class="media-block">
          <a href="https://ingeniocare.ai" target="_blank" rel="noopener">
            <img src="assets/images/enroll.jpg" alt="Provider enrollment">
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid-2 reverse">
        <div class="media-block">
          <img src="assets/images/invest.jpg" alt="Invest with Ingenio Care">
        </div>
        <div>
          <h2>Invest with Us.</h2>
          <h4>An exciting opportunity to participate at an early stage in a Startup with TAM of over $500B.</h4>
          <p><a href="4-19-2024-ingenio-care-1/">News: Ingenio Care Closes Pre-Seed Funding to Launch AI-Enabled, Patient-Centric Digital Health Network Pilots Now Open for IPAs, Employers, and Health Plans</a></p>
          <p>We are taking bold steps to solving some of the most complex challenges facing our healthcare system with an innovative approach that enables providers to seamlessly engage with patients. Our approach is fundamentally different than our competitors. While there are risks, we believe returns will be exponential. If you are with an early-stage VC firm, <a href="contact-us/">contact us</a>. we will be happy to walk you through the opportunity.</p>
          <p><a class="btn" href="mailto:alex.kumar@ingeniocare.com?subject=Investor%20Interest"><strong>Contact us</strong></a></p>
        </div>
      </div>
    </section>
"""

NETWORK = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Welcome to Ingenio Care</h1>
        <p class="lede">Building A Digital Health Patient Centric Network to Improve Quality of Care While Reducing Cost by Over 25% and Increasing Provider Income.</p>
        <a class="btn gold" href="../contact-us/">Contact Us</a>
      </div>
    </section>
    <section class="section">
      <div class="wrap grid-2">
        <div>
          <h2>A Patient Centric Digital Health Network</h2>
          <h4>A Patient Centric Platform to Optimize Healthcare.</h4>
          <p>Healthcare cost have continued to go up despite all the efforts being made to bend the cost curve. We spend more than two times the next most expensive healthcare system in the world, yet our outcomes and per-capita cost has continued to lag.</p>
          <p>In order to address rising cost and improve outcomes, there has been a focus on population health over the last decade. Despite huge investment in patient engagement, education, care-coordination and PCP centric solutions, the efforts have only had a marginal success.</p>
          <p><strong>Our approach to address our healthcare challenges is to razor focus on identifying patient who need care and deliver the necessary care with speed and efficiency. Patient Access and closely knit (not siloed) network of providers to respond to patient needs is key to our model.</strong></p>
        </div>
        <div class="media-block"><img src="../assets/images/delivery-network.png" alt="Digital health network"></div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap grid-2 reverse">
        <div class="media-block"><img src="../assets/images/patient-access.png" alt="Patient access"></div>
        <div>
          <h2>Solve Patient Access</h2>
          <h4>We have a unique patient access solution.</h4>
          <p>Our study indicates that the instant access to the right provider is critical to change quality and cost trajectory of our health system. Today's patient access model is highly disintegrated and full of inefficiencies. It takes a long time to get appointments.</p>
          <p>Our Patient Access Solution is designed to make access easier and fast by connecting provider and patient in real-time. As our network grows, it will tap into unused capacity across providers by making real-time connection possible - delivering care as soon as the need is identified.</p>
          <p>Based on our research, virtual instant physician consult to patient with identified need will have a significant impact on outcome and cost. Virtual real-time access will be impactful in a variety of settings including Home Care, Nursing Homes, SKNF, Emergency Rooms, Primary Care Clinics and Hospitals.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap grid-2">
        <div>
          <h2>Increase Provider Efficiency and Income</h2>
          <h4>We are reinventing patient provider engagement</h4>
          <p>We have observed patient/provider interaction and found that providers are spending way too much time sifting through history and inputting data required by administrators, but irrelevant to patient care. Our Ai driven physician assistant sifts through the patient history to bring relevant data to the physicians and creates documentation for them. Physicians gets more time with the same patient or solve for the needs of another patient.</p>
          <p>Providers on our network will be able to expand their patient panel, increase their income, and more importantly earn bonuses tied to quality/cost scorecards for each provider regardless of specialty.</p>
        </div>
        <div class="media-block"><img src="../assets/images/provider-efficiency.png" alt="Provider efficiency"></div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap grid-2 reverse">
        <div class="media-block"><img src="../assets/images/platform.png" alt="Authorizations platform"></div>
        <div>
          <h2>Seamless Authorizations/ Utilization Management</h2>
          <h4>Solving pre-auth through collaboration</h4>
          <p>Prior authorizations not only take physicians away from patient care, resulting delays due to lengthy process can meaningfully impact on outcomes. The industry has continued to struggle with this issue and solutions have had only a limited success.</p>
          <p>We intend to bring plans and providers together to share data in-stream and Ai to be the intermediary. If we are successful in getting adoption to our solution, the process will become more efficient, and plans may even provide recommendations to the provider. We believe in aligning the interests of patients, providers and payors to solve pre-auth challenges.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap grid-2">
        <div>
          <h2>Care Orchestration to Optimize Delivery</h2>
          <h4>Our care orchestration model relies on existing resources</h4>
          <p>In our innovative healthcare approach to care management, every patient journey begins with a real-time virtual consultation. We anticipate resolving a substantial number of cases through this digital gateway.</p>
          <p>Our care orchestration model is built upon care plan developed by the physician responsible to for care. While the PCP is the principal coordinator for wellness and chronic care plans, other conditions require specialists to own the plan and patient recovery.</p>
          <p>Our provider network will include high-quality fixed price bundles for high-cost frequent surgeries. These bundles will be surgeon driven as compared to current bundles that are hospital led. Our surgical procedures will utilize highly differentiated processes and tools. As a result, our bundles will be better quality and lower cost than those currently available.</p>
          <p>We plan to use pharmacy as key point for care-coordination and medication adherence, in comparison to prevailing programs that deploy ineffective centrally located care-coordinator model. We believe pharmacy centered model will be far more effective and economical.</p>
        </div>
        <div class="media-block"><img src="../assets/images/care-orchestration.png" alt="Care orchestration"></div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap grid-2 reverse">
        <div class="media-block"><img src="../assets/images/cost-quality.png" alt="Quality and cost of care"></div>
        <div>
          <h2>Quality and Cost of Care</h2>
          <h4>We are striving to transform US healthcare.</h4>
          <p>We believe our model is forward looking and brings elements of economic, operating and technology models to drive equitable, readily available patient access, higher quality and outcomes. Our approach to utilizing underutilized capacity, efficiency and meaningful incentives has a better chance than other prevailing models.</p>
        </div>
      </div>
    </section>
"""

ABOUT = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>About Us</h1>
        <h4>Ai Enabled, Patient Centric Digital Health Network</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap grid-2">
        <div>
          <p>Ingenio Care is an Ai powered Digital health company. We are building a patient centric healthcare network in which providers seamlessly collaborate to delivery high quality care, efficiently while increasing their income meaningfully. The network plans to achieve that by using Ai enabled solution to orchestrate care efficiently and effectively delivered though provider collaboration. Key areas of our focus include:</p>
          <ul>
            <li>Patient Access that is instant by leveraging unused provider capacity</li>
            <li>Ai Enabled Physican Assistant for Patient Notes and Coding</li>
            <li>Ai Enabled Physician Assistant for Care Planning and orchestration</li>
            <li>Ai Enabled Prior Authorization Solution</li>
            <li>Ai Enabled Post Discharge Robot</li>
          </ul>
          <p class="quote">"Although our healthcare system is complex and everchanging, we believe that it is possible to simplify it through innovative operating models, Use of Artificial Intelligence and use of advanced analytics techniques.</p>
          <p class="quote">We will love to partner with you create the futuristic Healthcare Network."</p>
        </div>
        <div class="media-block"><img src="../assets/images/alex.png" alt="Alex Kumar, Founder and CEO"></div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap article">
        <h4>Alex Kumar, Founder and CEO</h4>
        <p>Mr. Kumar is a highly accomplished innovator and entrepreneur with a strong focus on healthcare. He possesses extensive expertise in healthcare models, business strategy, data sciences, and software technologies. He has a proven track record of delivering disruptive healthcare solutions through conceptualizing new ideas and leveraging proficient agile software development methodologies.</p>
        <p>Throughout his career, Mr. Kumar has provided strategic guidance to early-stage companies and developed an analytics/AI-driven healthcare delivery model to tackle cost and quality issues that plagued the US healthcare system. As a founding member of two startups, he has led operations and technology innovation, both of which are now publicly traded with a market capitalization exceeding $2 billion.</p>
        <p>Moreover, as the leader of the Investment for Growth (IFG) initiative at R1RCM, Mr. Kumar developed a cost/quality offering that included an economic model, operating model, and an end-to-end technology platform with a commitment to reducing healthcare costs by 25% while enhancing the quality of care. This offering was the first of its kind in the industry.</p>
        <p>As the Chief Strategy and Technology Officer of R1RCM, Mr. Kumar designed and developed a groundbreaking end-to-end revenue cycle platform that delivered significant yield and revenue improvement for healthcare providers. This platform was the first of its kind in the healthcare industry.</p>
        <p>Before his entrepreneurial pursuits, Mr. Kumar worked for Accenture and PWC after graduating from the Indian Institute of Management, Ahmedabad.</p>
      </div>
    </section>
"""

NEWS = r"""
    <section class="page-hero">
      <div class="wrap"><h1>Ingenio Care News</h1></div>
    </section>
    <section class="section">
      <div class="wrap news-list">
        <article class="news-item">
          <p class="date">October 17, 2025, PRESS RELEASE</p>
          <p><a href="../7-08-2025-ingenio-care-1/">Advisory Board expands with top clinical and business experts guiding Ingenio Care’s AI-enabled platform for connected, patient-centric care</a></p>
        </article>
        <article class="news-item">
          <p class="date">July 8, 2025, PRESS RELEASE</p>
          <p><a href="../4-19-2024-ingenio-care-1/">Ingenio Care Closes Pre-Seed Funding to Launch AI-Enabled, Patient-Centric Digital Health Network — Pilots Now Open for IPAs, Employers, and Health Plans</a></p>
        </article>
        <article class="news-item">
          <p class="date">APRIL 19, 2024, PRESS RELEASE</p>
          <p><a href="../4-19-2024-ingenio-care/">Ingenio Healthcare Announces Ingenio Care: An AI-Enabled Patient-Centric Network</a></p>
        </article>
      </div>
    </section>
"""

CONTACT = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Contact Us</h1>
        <h4>Drop us a line!</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <form class="form" data-contact-form>
          <div>
            <label for="name">Name*</label>
            <input id="name" name="name" required>
          </div>
          <div>
            <label for="email">Email*</label>
            <input id="email" name="email" type="email" required>
          </div>
          <div>
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6"></textarea>
          </div>
          <label class="row">
            <input type="checkbox" name="newsletter">
            <span>Sign up for our email list for updates, promotions, and more.</span>
          </label>
          <button class="btn" type="submit">Send</button>
          <p class="form-note">This form opens your email client to send the message to Ingenio Care. Attach files in that email if needed.</p>
        </form>
        <p class="success">Thank you. Your message is ready to send.</p>
      </div>
    </section>
"""

PRIVACY = r"""
    <section class="page-hero">
      <div class="wrap"><h1>Privacy Policy</h1></div>
    </section>
    <section class="section">
      <div class="wrap article">
        <h2>Privacy Policy</h2>
        <p>At Ingenio Healthcare, we take the privacy of our website visitors very seriously. This Privacy Policy explains what information we collect and how we use it.</p>
        <p><strong>Information We Collect</strong> When you visit our website, we may collect information such as your IP address, browser type, and the pages you visit. We use this information to analyze trends, administer the site, track user's movements around the site, and gather demographic information about our user base as a whole. We do not link this automatically collected data to any personal information.</p>
        <p>We also collect personal information that you provide to us when you fill out a contact form, sign up for our newsletter, or request a consultation. This may include your name, email address, and phone number.</p>
        <p><strong>How We Use Your Information:</strong></p>
        <p>We use the information we collect to improve our website, respond to your inquiries, and send you relevant information about our consulting services. We do not sell or share your personal information with third parties except as required by law or as necessary to provide our services to you.</p>
        <p><strong>Cookies</strong> We use cookies on our website to help us analyze how visitors use the site. Cookies are small text files that are stored on your computer when you visit certain web pages. We use cookies to understand what content is popular, which helps us improve our website.</p>
        <p><strong>Security:</strong></p>
        <p>We take reasonable precautions to protect the personal information we collect from unauthorized access, use, and disclosure. However, no data transmission over the Internet or wireless network can be guaranteed to be 100% secure. As a result, we cannot guarantee the security of any information you transmit to us, and you do so at your own risk.</p>
        <p><strong>Changes to This Privacy Policy:</strong></p>
        <p>We reserve the right to modify this Privacy Policy at any time. If we make material changes to this policy, we will notify you by email or by posting a notice on our website.</p>
        <p>Contact Us If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:support@ingeniohc.com?subject=Privacy%20Inquiry">support@ingeniohc.com</a>.</p>
      </div>
    </section>
"""

PHYS = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Physician Advisory Board</h1>
        <h4>Innovating AI Enabled Patient Centric Network</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap article">
        <p>Ingenio Care has created a team of Physician to collaborate on next generation of healthcare delivery model. Our solution will evolve with a direct input and refinement by a diverse group of physicians. The goal of this team will be to evolve a patient centric solution that will make providers more efficient while delivering higher quality of care at a progressively lower cost.</p>
        <p class="quote">Physicians are the key to both quality and cost of any healthcare system. If we are to meet the challenges facing of healthcare system, we have to build an ecosystem, a network that enables them to bring their best to patient care.</p>
        <p class="quote">We intend to</p>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <h2>Physician Advisors</h2>
        <div class="grid-cards" style="margin-top:2rem">
          <article class="card">
            <img class="portrait" src="../assets/images/yogi.png" alt="Dr. Yogi Ahluwalia">
            <div class="card-body">
              <h4>Dr. Yogi Ahluwalia</h4>
              <p>Former Chairman of Psychiatry at Mount Sinai Hospital Medical Center of Chicago, Dr. Ahluwalia has dedicated his career to advancing psychiatric care and improving patient outcomes. Dr. Ahluwalia is collaborating with us to build models for behavioral health and underserved communities.</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/krishna-jain.jpg" alt="Dr. Krishna Jain">
            <div class="card-body">
              <h4>Dr. Krishna Jain</h4>
              <p>Dr. Jain is Chief Medical Officer for APEX and founder of Limb Preservation Centers of America®. He is a board-certified vascular surgeon who has been intimately involved in the growth of office-based endovascular labs (OBLs) throughout the U.S. since 2007.</p>
              <p>Dr. Jain is collaborating with us build a national population health solution for patients with high risk of foot ulcer and limb amputation</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/robert-wagner.jpg" alt="Dr. Robert Wagner">
            <div class="card-body">
              <h4>Dr. Robert Wagner</h4>
              <p>Dr. Robert Wagner has deep expertise in both clinical and operational aspects of healthcare. His primary focus is to improve the health of patients and communities through innovation. As an advisor to Ingenio Care, Rob plays critical role in the development of our solutions as well as its implementation.</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/robert-parker.jpeg" alt="Dr. Robert Parker">
            <div class="card-body">
              <h4>Dr. Robert Parker</h4>
              <p>Dr. Bob Parker is a primary care physician with a strong background in managed care. He is physician leader with history of clinical innovations. Dr. Parker advises the company on design development and testing of the solution from both the provider and payer perspective.</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/pradeep-thapar.jpg" alt="Dr. Pradeep Thapar">
            <div class="card-body">
              <h4>Dr. Pradeep Thapar</h4>
              <p>Dr. Thapar is a Board-Certified General Adult Psychiatrist and Child &amp; Adolescent Psychiatrist Trained at the University of Illinois at Chicago and Northwestern University. Dr. Thapar is collaborating with Ingenio Care on patient access for behavioral health and to build Ingenio collaborative care network in Orland Park.</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/rajeev-kumar.jpg" alt="Dr. Rajeev Kumar">
            <div class="card-body">
              <h4>Dr. Rajeev Kumar</h4>
              <p>Dr. Rajeev Kumar is a specializes in Geriatrics and Home Healthcare. Rajeev is a thought leader in Geriatric Care and the development of Home Healthcare models at United healthcare.</p>
              <p>Dr. Kumar is collaborating with us to develop Home Health, Assisted Living, SKNF models</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/puja-sethi.jpeg" alt="Dr. Puja Sethi">
            <div class="card-body">
              <h4>Dr. Puja Sethi</h4>
              <p>Dr. Sethi has over 10 year of experience as practicing physician. Dr. Sethi is Board Certified Sleep Medicine.</p>
              <p>Dr Sethi is collaborating with us on care model innovation, and how to optimize processes that improve quality while reducing physician's administrative burden.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
"""

HAB = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Healthcare Advisory Board</h1>
        <h4>Innovating AI Enabled Patient Centric Care Delivery</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap article">
        <p>Ingenio Care has created a team of Healthcare Advisors from with a high level of expertise in healthcare delivery from across a cross section of healthcare domains, including RCM, Value Based Care and Administration. Healthcare Advisors collaborate with physician advisors to build patient centric economic and operating model to synergize patient, payer and provider continuum.</p>
        <p class="quote">"Although our healthcare system is complex and everchanging, we believe that it is possible to simplify it through innovative operating models, Use of Artificial Intelligence and use of advanced analytics techniques.</p>
        <p class="quote">We will love to partner with you create the futuristic Healthcare Network."</p>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <h2>Healthcare Industry Advisors</h2>
        <div class="grid-cards" style="margin-top:2rem">
          <article class="card">
            <img class="portrait" src="../assets/images/sanjiv.jpeg" alt="Sanjiv Anand">
            <div class="card-body">
              <h4>Sanjiv Anand</h4>
              <p>Sanjeev has an impressive track record of driving growth and transformation in the healthcare sector, successfully scaling multiple companies. He has held leadership roles at Hewitt Associates, Xerox, and Bswift/Aetna.</p>
              <p>Sanjeev is collaborating with Ingenio Care to develop overall care model, specially from the health plan perspective</p>
              <p>Sanjeev holds an MBA from Northwestern University and a B. Tech from IIT Madras.</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/paul-lavin.jpg" alt="Paul Lavin">
            <div class="card-body">
              <h4>Paul Lavin</h4>
              <p>Paul Lavin has extensive experience in healthcare and technology innovation. He has held key leadership roles, including Lead Independent Director at Guidewire Software, Executive Director at First Health Group, and President &amp; CEO of American Health Holding. Paul's background spans roles at BearingPoint, Prudential Financial, and Mercer. He holds an MBA and a BS from The Wharton School at the University of Pennsylvania.</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/anil-lal.jpeg" alt="Anil Lal">
            <div class="card-body">
              <h4>Anil Lal</h4>
              <p>An executive with University of Chicago leading their Radiology Oncology group, Anil has extensive experience in healthcare development and management. Anil is collaborating with us to develop unique features of Ingenio care Network and to integrate outpatient services within the patients care plan. Anil has MBBS, MBA and MPH from the University of Minnesota</p>
            </div>
          </article>
          <article class="card">
            <img class="portrait" src="../assets/images/duane.jpeg" alt="Duane Lisowski">
            <div class="card-body">
              <h4>Duane Lisowski</h4>
              <p>Mr. Lisowski has over 20 year of operational leadership experience in healthcare industry. With a healthcare MBA from Duke University, Duane's prior experience includes R1RCM, City of Hope and Envision Health among others. Duane is collaborating with Ingenio Care to develop models in the area of RCM and Value-based care.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
"""

BLOGS = r"""
    <section class="page-hero">
      <div class="wrap"><h1>Account sign in</h1></div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="auth-box">
          <p>Sign in to your account to access your profile, history, and any private pages you've been granted access to.</p>
          <form class="form" action="../m/account/" method="get">
            <div>
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required>
            </div>
            <div>
              <label for="password">Password</label>
              <input id="password" name="password" type="password" required>
            </div>
            <button class="btn" type="submit">Sign in</button>
            <p><a href="../m/account/">Reset password</a></p>
            <p>Not a member? <a href="../m/create-account/">Create account.</a></p>
          </form>
        </div>
      </div>
    </section>
"""

ACCOUNT = r"""
    <section class="page-hero">
      <div class="wrap"><h1>My Account</h1></div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="auth-box">
          <p>Sign in to your account to access your profile, history, and any private pages you've been granted access to.</p>
          <form class="form">
            <div>
              <label for="email">Email</label>
              <input id="email" type="email" required>
            </div>
            <div>
              <label for="password">Password</label>
              <input id="password" type="password" required>
            </div>
            <button class="btn" type="submit">Sign in</button>
            <p>Not a member? <a href="../create-account/">Create account.</a></p>
          </form>
        </div>
      </div>
    </section>
"""

CREATE = r"""
    <section class="page-hero">
      <div class="wrap"><h1>Create account</h1></div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="auth-box">
          <p>Create an account to access member pages and updates from Ingenio Care.</p>
          <form class="form">
            <div>
              <label for="name">Name</label>
              <input id="name" required>
            </div>
            <div>
              <label for="email">Email</label>
              <input id="email" type="email" required>
            </div>
            <div>
              <label for="password">Password</label>
              <input id="password" type="password" required>
            </div>
            <button class="btn" type="submit">Create account</button>
            <p>Already a member? <a href="../account/">Sign in.</a></p>
          </form>
        </div>
      </div>
    </section>
"""

PR_OCT = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Press Release - 7/8/2025</h1>
        <h4>October 17, 2025, PRESS RELEASE</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap article">
        <h3>Advisory Board expands with top clinical and business experts guiding Ingenio Care’s AI-enabled plat</h3>
        <p>OAK BROOK, Ill., Oct. 17, 2025 (GLOBE NEWSWIRE) -- Ingenio Care, Inc., an AI-driven digital health company, today announced the expansion of its distinguished Advisory Board, bringing together renowned clinical and business leaders to help guide its next phase of growth. The move reflects Ingenio Care’s continued momentum in building a connected, AI-enabled healthcare network that improves access, coordination, and affordability for patients, providers, and payers alike.</p>
        <p>Ingenio Care simplifies the healthcare experience through real-time scheduling, intelligent documentation, and coordinated follow-up across all settings of care. The platform empowers patients with immediate access to trusted providers, consolidated health records, and personalized care plans—while helping providers and payers achieve measurable cost savings and operational efficiency.</p>
        <p>“Our advisory board brings together exceptional experience across clinical delivery, health systems, and payer innovation,” said Alex Kumar, CEO of Ingenio Healthcare. “Their support underscores our mission to redesign healthcare around patients—with technology, data, and collaboration at its core.”</p>
        <h3>Advisory Board: Bridging Innovation and Real-World Care</h3>
        <p>Ingenio Care’s Advisory Board combines front-line clinical expertise with strategic insight to ensure its platform remains innovative, practical, and outcomes driven.</p>
        <h3>Clinical Advisors</h3>
        <p>Dr. Yogi Ahluwalia, former Chairman of Psychiatry at Mount Sinai Hospital Chicago, leads Ingenio Care’s behavioral-health and underserved-population initiatives, developing scalable models that expand access and improve outcomes.</p>
        <p class="quote">“Ingenio Care doesn’t just digitize care—it orchestrates it. By aligning data, access, and collaboration, it’s making value-based care both practical and sustainable.” — Dr. Yogi Ahluwalia</p>
        <p>Dr. Pradeep Thapar, Board-Certified Adult and Child &amp; Adolescent Psychiatrist trained at the University of Illinois and Northwestern University, advises on expanding Ingenio Care’s behavioral-health network and collaborative-care integration.</p>
        <p class="quote">“Patient access is a barrier to patient outcomes, cost, and provider efficiency—and that challenge has driven our innovation into the Ingenio Care platform.” — Dr. Pradeep Thapar</p>
        <p>Dr. Robert Parker, a primary-care physician with extensive managed-care experience, guides provider-side workflow design to ensure the platform enhances both clinical efficiency and patient engagement.</p>
        <p class="quote">“I’ve been part of testing the platform, and it has come a long way in helping patients manage their health while improving physician–patient interaction through AI.” — Dr. Robert Parker</p>
        <p>Dr. Robert Wagner, a physician-leader with deep experience in clinical operations and healthcare innovation, plays a key role in translating clinical insight into technology-enabled solutions.</p>
        <p class="quote">“I really like the fact that it offers patient-centric tools and that the record is placed into the patient’s phone—not locked in provider silos. This enables patients to get care wherever they may be.” — Dr. Robert Wagner</p>
        <p>Dr. Krishna Jain, a vascular surgeon and pioneer in outpatient and ambulatory surgical care, contributes his expertise in specialty-care integration and value-based procedural delivery.</p>
        <p class="quote">“When I first looked at the platform, I found it to be highly innovative, and I believe it can drive both outcomes and efficiency for the diabetic population that is at risk of losing limbs.” — Dr. Krishna Jain</p>
        <h3>Strategic &amp; Industry Advisors</h3>
        <p>Sanjiv Anand, MBA, former executive at Hewitt Associates, Bswift/Aetna, and Xero, chairs the strategic advisory group, shaping Ingenio Care’s operating and economic models from a payer and provider perspective.</p>
        <p class="quote">“This platform has the potential to fundamentally improve employer-sponsored healthcare. By enhancing patient experience, compliance, and navigation, Ingenio Care can drive better outcomes and lower costs for employers while improving the overall health of their workforce.” — Sanjiv Anand, MBA</p>
        <p>Paul Lavin, MBA, former President &amp; CEO of American Health Holding and Lead Independent Director at Guidewire Software, brings decades of experience in healthcare technology and payer innovation.</p>
        <p>Anil Lal, MPH, healthcare executive with the University of Chicago Radiology group, advises on integrating outpatient and specialty services into Ingenio Care’s coordinated-care network.</p>
        <p>Duane Lisowski, MBA, veteran of R1RCM and City of Hope, provides guidance on revenue-cycle optimization and performance analytics.</p>
        <p>Together, these leaders ensure Ingenio Care continues to address healthcare’s most persistent inefficiencies by aligning patient experience, provider workflows, and payer incentives through intelligent automation.</p>
        <h3>Platform Highlights</h3>
        <ul>
          <li>Instant Provider Access: Patients can connect with local, in-network providers for virtual visits—often within minutes.</li>
          <li>Centralized Health Records: A secure, unified repository for complete patient histories.</li>
          <li>AI-Powered Care Plans: Automated assignment of personalized preventive plans for at-risk patients.</li>
          <li>Coordinated Care Continuation: Immediate visibility of discharge instructions, medications, and follow-up plans.</li>
          <li>Payer-Ready Infrastructure: Built-in tools for utilization management, referral intelligence, and bundled-payment readiness.</li>
        </ul>
        <h3>Building Momentum Toward National Scale</h3>
        <p>As Ingenio Care prepares for its seed funding round, the company continues to enhance its platform through insights from patients, clinicians, and its growing advisory network.</p>
        <p>“Having this caliber of leadership behind us shows the system’s readiness for meaningful change,” added Kumar. “Ingenio Care is not just another health-tech product—it’s the connective tissue of a smarter, more equitable healthcare future.”</p>
        <h3>Meet Ingenio Care at HLTH 2025</h3>
        <p>Ingenio Care will be exhibiting at HLTH 2025 within the Digital Health Foundation booth (#1760-46). Attendees are invited to stop by to experience a live demo of the Ingenio Care platform and meet members of the leadership team. If you’re attending HLTH, please visit us at Booth 1760-46 to learn how Ingenio Care is transforming the future of patient access, care coordination, and value-based health innovation.</p>
        <h3>About Ingenio Care</h3>
        <p>Ingenio Care, Inc. is a digital health company focused on creating a patient-centric, AI-enabled healthcare network that connects patients, providers, and payers in real time. Through its platform, Ingenio Care simplifies care delivery, improves coordination, and reduces costs—empowering patients while enabling providers to deliver higher-quality, value-based care. Learn more at <a href="https://ingeniocare.ai">https://ingeniocare.ai</a></p>
        <p><strong>Media Contact</strong><br>Rohin Gopalka<br><a href="mailto:rohin.gopalka@ingeniocare.com">rohin.gopalka@ingeniocare.com</a></p>
      </div>
    </section>
"""

PR_JULY = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Press Release - 7/8/2025</h1>
        <h4>July 8, 2025, PRESS RELEASE</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap article">
        <h3>Ingenio Care Closes Pre-Seed Funding to Launch AI-Enabled, Patient-Centric Digital Health Network — Pilots Now Open for IPAs, Employers, and Health Plans</h3>
        <p>OAK BROOK, Ill., July 08, 2025 (GLOBE NEWSWIRE) -- Ingenio Care, an AI-enabled, patient-centric digital health network, today announced the successful close of its pre-seed funding round. The company is preparing to launch pilot programs with Independent Physician Associations (IPAs), self-insured employers, and health plans, introducing a platform designed to resolve the systemic challenges of access, fragmentation, and administrative inefficiency in U.S. healthcare.</p>
        <h3>A Smarter Network for a System in Crisis</h3>
        <p>The healthcare ecosystem is strained like never before: patients face weeks-long wait times, providers are bogged down by administrative burdens, and payers are scaling back services amid rising costs. Even once-promising centralized care models like Oak Street Health and VillageMD are facing major challenges, exposing the limits of top-down disruption.</p>
        <p>Ingenio Care offers a fundamentally different model: a scalable digital health network that enhances existing infrastructure with real-time data, automation, and seamless coordination — placing the patient at the center.</p>
        <p>“We are no longer just talking about inefficiency — we’re talking about dysfunction,” said Alex Kumar, Founder and CEO of Ingenio Care. “Ingenio Care was built to be the connective layer the system desperately needs — linking patients, providers, and payers into a smarter, faster, and more responsive network.”</p>
        <h3>The Ingenio Care App: Patient-Centric and System-Aware</h3>
        <p>At the core of Ingenio Care is a first-of-its-kind patient app that gives individuals the ability to manage their care and costs through a single digital experience:</p>
        <ul>
          <li>Instant access to available, in-network providers across primary, specialty, and behavioral care</li>
          <li>Seamless care navigation including referrals, follow-ups, and care plan coordination</li>
          <li>Cost transparency to help patients make informed decisions</li>
          <li>Continuity of care even across insurance or employer changes — a first in U.S. healthcare</li>
          <li>Upcoming integration with credit cards for identity verification, reducing fraud and intake errors</li>
        </ul>
        <p>“Patients shouldn’t have to start over every time they change plans or employers,” said Kumar. “We’ve built the first system that follows the patient — not the paperwork.”</p>
        <p>The Ingenio Care platform reduces the frequency of future ER visits and hospital admissions, increasing patient outcomes and satisfaction while simultaneously reducing expenditure from providers and systems.</p>
        <h3>Reducing Wait Times by Unlocking Capacity</h3>
        <p>By intelligently matching patients with underutilized providers and increasing provider efficiency, Ingenio Care believes it can cut wait times by 30% to 50%. The platform identifies availability in real time and guides patients toward timely, appropriate care — improving both experience and outcomes.</p>
        <p>“There’s untapped capacity in the system today,” said Kumar. “Our platform unlocks it by reducing friction, connecting the dots, and giving providers better tools to manage their day-to-day work.”</p>
        <h3>Network Effects: Growing Value for All Participants</h3>
        <p>As the Ingenio Care network expands, all stakeholders benefit — including providers. Physicians and care organizations gain access to a natural flow of in-network patients actively navigating through the platform. This reduces the need for expensive marketing and patient acquisition campaigns, while simultaneously lowering administrative overhead through automation and integration.</p>
        <p class="quote">“Ingenio Care brings patients to us more efficiently — and helps us serve them better,” said Dr. Yogi Ahluwalia, Chair of Psychiatry at Mount Sinai Hospital Medical Center of Chicago. “It’s the kind of infrastructure that scales with us, not against us.”</p>
        <p class="quote">“We're excited to be part of something that enhances care without disrupting how we practice,” added Dr. Pradeep Thapar, owner of Premier Psychiatry. “This is what the next generation of clinical operations should look like.”</p>
        <h3>Pilots Now Open</h3>
        <p>Ingenio Care is enrolling pilot sites across provider networks, employers, and health plans. Initial pilots will measure improvements in appointment access, care navigation, administrative burden, and cost-effectiveness.</p>
        <p>To learn more or join a pilot program, visit <a href="https://ingeniocare.com">www.ingeniocare.com</a> or contact Ingenio Care.</p>
        <h3>About Ingenio Care</h3>
        <p>Ingenio Care is an AI-enabled, patient-centric digital health network that empowers patients, providers, and payers through intelligent access, real-time coordination, and simplified infrastructure. With a first-of-its-kind app and a platform designed for real-world scalability, Ingenio Care delivers the tools to restore healthcare’s promise — better care, smarter systems, and shared value.</p>
      </div>
    </section>
"""

PR_APRIL = r"""
    <section class="page-hero">
      <div class="wrap">
        <h1>Press Release -4/19/2024</h1>
        <h4>APRIL 19, 2024, PRESS RELEASE</h4>
      </div>
    </section>
    <section class="section">
      <div class="wrap article">
        <h3>Ingenio Healthcare Announces Ingenio Care: An AI-Enabled Patient-Centric Network</h3>
        <p>Oak Brook, IL, April 19, 2024 – Ingenio Healthcare today announced the launch of its AI-enabled patient-centric network, Ingenio Care. This innovative solution is expected to revolutionize the US healthcare by leveraging AI to deliver patient-centric care, improving outcomes while reducing cost.</p>
        <p>Ingenio Care is designed to provide timely and personalized care to patients, eliminating the need for manual navigation through the healthcare system. The platform connects patients directly with providers to define care plans and seamlessly coordinate care among all involved parties. utilizing synchronous AI, Ingenio Care acts as a physician scribe, significantly boosting provider productivity. The platform's patent-pending patient access platform is expected to enhance outcomes, reduce the cost of care, and improve provider income simultaneously.</p>
        <p>"Our mission is to enhance the healthcare system by prioritizing patient access and providing proactive, physician-led care plans," said Alex Kumar, CEO of Ingenio Healthcare. "With our AI-enabled patient-centric network, we are reshaping healthcare, making it more accessible, personalized, and affordable for all."</p>
        <p>Key features of Ingenio Care's AI-enabled patient-centric network include:</p>
        <ul>
          <li>Instant Access: Patients can access healthcare services anytime, anywhere, with the click of a button, ensuring timely interventions and proactive management of health concerns.</li>
          <li>Effective Care Plans: The platform leverages instant physician access to develop appropriate care plans tailored to each patient's needs. AI algorithms assist physicians in generating personalized care plans, optimizing health outcomes and driving patient engagement.</li>
          <li>Continuity and Coordination of Care: By facilitating seamless communication and collaboration among healthcare providers, the network ensures continuity of care across different settings and specialties, preventing gaps in treatment and promoting holistic care delivery.</li>
          <li>Efficient Network of Providers: A diverse network of top-tier healthcare providers, from primary care physicians to specialists, ensures that patients have access to high-quality care at every stage of their healthcare journey.</li>
          <li>Quality and Performance Bonuses: We will design and implement provider bonuses in partnership with payers. The bonuses will be tied to active participation on our network and delivery quality of care and cost efficiencies. We also plan to create an equity pool to share with our network partners.</li>
        </ul>
        <p>Through these innovative features, Ingenio Care will deliver unparalleled value to patients, providers, and payers alike, driving improved health outcomes, enhanced patient satisfaction, and significant cost savings across the healthcare ecosystem.</p>
        <p>"We believe that by harnessing the power of AI and placing patients at the forefront of healthcare delivery, we can create a more equitable, efficient, and sustainable healthcare system for all. We believe our model is vastly different from Primary Care Models used by companies like Alignment Health, Chen Med, Bright Health, Oak Street Health, Village MD that use dedicated care coordinators and often using healthcare resources on patient who may not need it " added Alex.</p>
        <p>Join us in ushering in a new era of healthcare excellence with Ingenio Care's AI-enabled patient-centric network. For more information, visit <a href="https://www.ingeniohc.com">http://www.ingeniohc.com</a>.</p>
        <h3>About Ingenio Healthcare:</h3>
        <p>Ingenio Healthcare is a healthcare startup with a mission to solve key challenges facing the US healthcare system. The company was founded by Alex Kumar, who also co-founded Accretive Health (now R1RCM). At Accretive Health, Kumar innovated an end-to-end Revenue Cycle Management (RCM) platform for hospitals. Subsequently, he developed the first end-to-end care management platform to manage cost and quality at Fairview ACO.</p>
        <p>Ingenio Healthcare is committed to revolutionizing healthcare delivery through innovative technologies and patient-centric approaches, building upon Alex's extensive experience and expertise in healthcare innovation and management.</p>
        <p><strong>Media Contact:</strong><br>Anant Garg<br><a href="mailto:anant.garg@ingeniohc.com">anant.garg@ingeniohc.com</a></p>
      </div>
    </section>
"""

NOT_FOUND = r"""
    <section class="page-hero">
      <div class="wrap"><h1>Page Not Found</h1></div>
    </section>
    <section class="section">
      <div class="wrap center">
        <p>The page you requested is not available.</p>
        <p><a class="btn" href="/">Return Home</a></p>
      </div>
    </section>
"""


def main():
    pages = [
        ("index.html", "Ingenio Care", 0, "Home", HOME),
        ("network/index.html", "Network", 1, "Network", NETWORK),
        ("about-us/index.html", "About Us", 1, "About Us", ABOUT),
        ("news/index.html", "News", 1, "News", NEWS),
        ("contact-us/index.html", "Contact Us", 1, "Contact Us", CONTACT),
        ("privacy-policy/index.html", "IngenioCare", 1, "", PRIVACY),
        ("physician-advisory-board/index.html", "Physician Advisory Board", 1, "Physician Advisory Board", PHYS),
        ("healthcare-advisory-board/index.html", "Healthcare Advisory Board", 1, "Healthcare Advisory Board", HAB),
        ("blogs/index.html", "Login", 1, "Blogs", BLOGS),
        ("m/account/index.html", "My Account", 2, "", ACCOUNT),
        ("m/create-account/index.html", "Create Account", 2, "", CREATE),
        ("7-08-2025-ingenio-care-1/index.html", "10-17-2025 Ingenio Care", 1, "News", PR_OCT),
        ("10-17-2025-ingenio-care/index.html", "10-17-2025 Ingenio Care", 1, "News", PR_OCT),
        ("4-19-2024-ingenio-care-1/index.html", "4-19-2024 Ingenio Care", 1, "News", PR_JULY),
        ("4-19-2024-ingenio-care/index.html", "4-19-2024 Ingenio Care | Ingenio Care", 1, "News", PR_APRIL),
        ("404.html", "IngenioCare", 0, "", NOT_FOUND),
    ]
    for rel, title, depth, active, body in pages:
        write(rel, page(title, depth, active, body))


if __name__ == "__main__":
    main()
