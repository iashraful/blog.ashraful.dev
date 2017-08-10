<?php
    include 'server_scripts/config.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        $ref = $_GET['ref'];
        if($ref == "subscriber") {
            $email = $_POST['subscriber_email'];
            $sql = "INSERT INTO `subscribe`(`email`) VALUES ('".$email."')";
            $conn->query($sql);
        }

        if($ref == "contact") {
            $name = $_POST['name'];
            $email = $_POST['email'];
            $subject = $_POST['subject'];
            $message = $_POST['message'];

            $sql_query = "INSERT INTO `contact`(`name`, `email`, `subject`, `message`) VALUES ('".$name."', '".$email."', '".$subject."', '".$message."')";
            $conn->query($sql_query);
        }
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <!-- Meta Tag -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- SEO -->
    <meta name="description" content="I am not a code rapist. I always focus on making a good recipe of codes.">
    <meta name="author" content="Personal Page">
    <meta name="url" content="https://www.iashraful.me">
    <meta name="copyright" content="Ashraful Islam">
    <meta name="robots" content="index,follow">


    <title>Ashraful Islam | Python Lover, JS Fan, Software Enthusiast</title>

    <!-- Favicon -->
    <link rel="shortcut icon" href="images/favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="144x144" type="image/x-icon" href="images/favicon/apple-touch-icon.png">

    <!-- All CSS Plugins -->
    <link rel="stylesheet" type="text/css" href="css/plugin.css">

    <!-- Main CSS Stylesheet -->
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <!-- Google Web Fonts  -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:400,300,500,600,700">


    <!-- HTML5 shiv and Respond.js support IE8 or Older for HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->


</head>

<body>

<!-- Preloader Start -->
<div class="preloader">
    <p>Loading...</p>
</div>
<!-- Preloader End -->


<!-- Menu Section Start -->
<header id="home">

    <div class="header-top-area">
        <div class="container">
            <div class="row">

                <div class="col-sm-3">
                    <div class="logo">
                        <a href="">Ashraful</a>
                    </div>
                </div>

                <div class="col-sm-9">
                    <div class="navigation-menu">
                        <div class="navbar">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle" data-toggle="collapse"
                                        data-target=".navbar-collapse">
                                    <span class="sr-only">Toggle navigation</span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                </button>
                            </div>
                            <div class="navbar-collapse collapse">
                                <ul class="nav navbar-nav navbar-right">
                                    <li class="active"><a class="smoth-scroll" href="#home">Home
                                        <div class="ripple-wrapper"></div>
                                    </a>
                                    </li>
                                    <li><a class="smoth-scroll" href="#experiences">Experience</a>
                                    </li>
                                    <li><a class="smoth-scroll" href="#about">About</a>
                                    </li>
                                    </li>
                                    <li><a class="smoth-scroll" href="#contact">Contact</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
<!-- Menu Section End -->


<!-- Home Section Start -->
<section class="home-section">
    <div class="container">
        <div class="row">

            <div class="col-sm-offset-2 col-md-4 col-sm-6 margin-left-setting">
                <div class="margin-top-150">

                    <div class="table-responsive">
                        <table class="table">
                            <tr>
                                <td>Name</td>
                                <td>Ashraful Islam</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>ashraf@iashraful.me</td>
                            </tr>
                            <tr>
                                <td>Designation</td>
                                <td>Software Engineer</td>
                            </tr>
                            <tr>
                                <td>Experience</td>
                                <td>1.3 Years</td>
                            </tr>
                            <tr>
                                <td>Contact</td>
                                <td>+8801624153810</td>
                            </tr>
                            <tr>
                                <td>Resume</td>
                                <td style="background-color: #f7639a;"><a href="#" target="_blank" data-toggle="tooltip"
                                                                          data-placement="top"
                                                                          title="Check Out My Resume">Resume.pdf</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-5 col-sm-6">
                <div class="me-image">
                    <img src="images/bg/profile.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Home Section End -->


<!-- Experience Start -->
<section class="section-space-padding" id="experiences">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="section-title">
                    <h2>My Experience.</h2>
                    <div class="divider dark">
                        <i class="icon-graduation"></i>
                    </div>
                    <!-- <p>Work experience and Educational qualifications</p> -->
                </div>
            </div>
        </div>

        <div class="row">

            <div class="col-md-6 col-sm-6">
                <div class="experience">

                    <div class="experience-item">
                        <div class="experience-circle">
                            <i class="icon-graduation"></i>
                            <p>2014 to 2018</p>
                        </div>
                        <div class="experience-content experience-color-blue">
                            <h4>Bachelor in CSE</h4>
                            <h6>IUBAT University</h6>
                            <p>Started at Spring 2014. I am not finished yet. But I hope to finish in this year.</p>
                        </div>
                    </div>

                    <div class="experience-item">
                        <div class="experience-circle">
                            <i class="icon-trophy"></i>
                            <p>2011 to 2012</p>
                        </div>
                        <div class="experience-content experience-color-blue">
                            <h4>College Education</h4>
                            <h6>Milestone College, Uttara, Dhaka 1230</h6>
                            <p>Milestone College is non government institution situated at Uttara, Dhaka. My session was
                                2011-2012.</p>
                        </div>
                    </div>

                    <div class="experience-item">
                        <div class="experience-circle">
                            <i class="icon-book-open"></i>
                            <p>2006 to 2011</p>
                        </div>
                        <div class="experience-content experience-color-blue">
                            <h4>High School Education</h4>
                            <h6>B.N.B High School</h6>
                            <p>2006 to 2010</p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-md-6 col-sm-6">
                <div class="experience">

                    <div class="experience-item">
                        <div class="experience-circle experience-company pink-color-bg">
                            <i class="icon-energy"></i>
                        </div>
                        <div class="experience-content">
                            <h4>Field Information Solutions Ltd.</h4>
                            <h6>Currently Working, Jr. Software Engineer</h6>
                            <p>Working as a backend engineer with Python, Django, Django REST Framework.</p>
                        </div>
                    </div>

                    <div class="experience-item">
                        <div class="experience-circle experience-company pink-color-bg">
                            <i class="icon-compass"></i>
                        </div>
                        <div class="experience-content">
                            <h4>Interconnection Ltd.</h4>
                            <h6>2016-2017, Trainee Software Engineer</h6>
                            <p>I was working as a full stack web engineer with Python, Django, Django REST Framework,
                                AngularJs, React Native</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</section>
<!-- Experience End -->


<!-- About Start -->
<section id="about" class="about section-space-padding">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="section-title">
                    <h2>About Me.</h2>
                    <div class="divider dark">
                        <i class="icon-emotsmile"></i>
                    </div>
                    <!-- <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p> -->
                </div>
            </div>
        </div>


        <div class="row">

            <div class="col-md-6">
                <div class="about-me-text margin-top-50">
                    <p>
                        I am a CS graduate. I love to make a good recipe of codes, open source enthusiast,
                        team worker and self motivated person.I love music, movies, hacking. Favorite qoute,
                        <strong><i>When your computer is telling you something, there must be some reason.</i></strong> I am big fan JS (Specially
                        ES6). Already started loving the architechture of facebook flux.
                        
                        <br/>
                        <a href="#" data-toggle="modal" data-target="#skillmodal" title="My Skills">
                            <b style="float: right; font-size: 1.5rem;">Check out my Skills</b>
                        </a> 
                        
                    </p>
                </div>
            </div>

            <div class="col-md-6">
                <div class="about-me-text pattern-bg margin-top-50 margin-bottom-50">
                    <div class="text-center">
                        <a class="button button-style button-style-dark button-style-color-2" data-toggle="modal"
                           data-target="#subscribemodal" href="#">Subscribe</a>
                    </div>
                </div>

                <div class="about-me-text">

                    <ul class="social-icon">
                        <li><a href="https://www.facebook.com/ThisIsMrRobin" target="_blank" class="facebook"><i
                                class="icon-social-facebook"></i></a></li>
                        <li><a href="https://twitter.com/__ashraful" target="_blank" class="twitter"><i
                                class="icon-social-twitter"></i></a></li>
                        <li><a href="https://www.linkedin.com/in/~ashraful/" target="_blank" class="linkedin"><i
                                class="icon-social-linkedin"></i></a></li>
                        <li><a href="https://github.com/iamashraful" target="_blank" class="github"><i
                                class="icon-social-github"></i></a></li>
                    </ul>

                </div>
            </div>

        </div>
    </div>
</section>

<!-- Skills Modal Start -->
<div class="modal fade padding-top-70" id="skillmodal" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content pattern-bg">
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="section-title margin-top-30">
                            <button type="button" class="btn pull-right" data-dismiss="modal"><i
                                    class="fa fa-close"></i></button>
                            <h2>My Skills.</h2>
                            <div class="divider dark">
                                <i class="icon-energy"></i>
                            </div>
                            <!-- <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p> -->
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-offset-2 col-xs-offset-0 col-md-8 col-sm-8">

                        <div class="my-skill margin-bottom-50">
                            <strong>Python</strong>
                            <span class="pull-right">50%</span>
                            <div class="progress">
                                <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="85"
                                     aria-valuemin="0" aria-valuemax="100" style="width: 50%;">
                                </div>
                            </div>

                            <strong>Django</strong>
                            <span class="pull-right">55%</span>
                            <div class="progress">
                                <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="99"
                                     aria-valuemin="0" aria-valuemax="100" style="width: 55%;">
                                </div>
                            </div>

                            <strong>REST API</strong>
                            <span class="pull-right">57%</span>
                            <div class="progress">
                                <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="85"
                                     aria-valuemin="0" aria-valuemax="100" style="width: 57%;">
                                </div>
                            </div>

                            <strong>Javascript</strong>
                            <span class="pull-right">45%</span>
                            <div class="progress">
                                <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="90"
                                     aria-valuemin="0" aria-valuemax="100" style="width: 45%;">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Skills Modal End -->


<!-- Subscribe Modal Start -->
<div class="modal fade subscribe padding-top-120" id="subscribemodal" role="dialog">
    <div class="modal-dialog">


        <div class="modal-content">
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="section-title margin-top-30">
                            <button type="button" class="btn pull-right" data-dismiss="modal"><i
                                    class="fa fa-close"></i></button>
                            <h2>Subscribe.</h2>
                            <div class="divider dark">
                                <i class="icon-envelope-letter"></i>
                            </div>
                            <p>Subscribe if you need daily blog post update??</p>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-offset-2 col-xs-offset-0 col-md-8 col-sm-8">

                        <div class="margin-bottom-50">
                            <form id="mc-form" method="POST" action="?ref=subscriber" onsubmit="return subscriber()">
                                <div class="subscribe-form">
                                    <input id="mc-email" type="email" name="subscriber_email" placeholder="Email Address" class="text-input" required>
                                    <input class="submit-btn" type="submit" value="Submit">
                                </div>
                                <label for="mc-email" class="mc-label"></label>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Subscribe Modal End -->
<!-- About End -->



<!-- Call to Action Start -->
<section class="call-to-action bg-cover section-space-padding text-center">
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <h2>Do You Want to Know More About Me?</h2>
            </div>

            <div class="col-md-4">
                <div class="text-center">
                    <a class="button button-style button-style-color-2 smoth-scroll" href="#contact">Contact Me</a>
                </div>

            </div>
        </div>
    </div>
</section>
<!-- Call to Action End -->


<!-- Contact Start -->
<section id="contact" class="section-space-padding">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="section-title">
                    <h2>Contact Me.</h2>
                    <div class="divider dark">
                        <i class="icon-envelope-open"></i>
                    </div>
                    <p>Please don't through some buzz words.</p>
                </div>
            </div>
        </div>


        <div class="margin-top-30 margin-bottom-50">
            <div class="row">

                <div class="col-md-offset-3 col-sm-offset-2 col-md-6 col-sm-8">

                    <div class="row">
                        <div class="contact-us-detail"><a href="mailto:name@domain.com">ashraf@iashraful.me</a></div>
                        <form class="contact-us pattern-bg" method="POST" action="?ref=contact">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input type="text" id="name" name="name" class="form-control" placeholder="Your Name">
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input type="email" id="email" name="email" class="form-control" placeholder="Your Email" required>
                                </div>
                            </div>

                            <div class="col-sm-12">
                                <div class="form-group">
                                    <input type="text" id="subject" name="subject" class="form-control" placeholder="Subject" required>
                                </div>
                            </div>


                            <div class="col-sm-12">
                                <div class="textarea-message form-group">
                                    <textarea id="message" class="textarea-message form-control"
                                              name="message" placeholder="Your Message" rows="5" required>

                                    </textarea>
                                </div>
                            </div>


                            <div class="text-center">
                                <button type="submit"
                                        class="button button-style button-style-dark button-style-color-2">Submit
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>


        </div>
    </div>
</section>
<!-- Contact End -->


<!-- Footer Start -->
<footer class="footer-section">
    <div class="container">
        <div class="row">

            <div class="col-md-12">
                <ul class="social-icon margin-bottom-30">
                    <li><a href="https://www.facebook.com/ThisIsMrRobin" target="_blank" class="facebook"><i class="icon-social-facebook"></i></a></li>
                    <li><a href="https://twitter.com/__ashraful" target="_blank" class="twitter"><i class="icon-social-twitter"></i></a></li>
                    <li><a href="https://plus.google.com/103878585161155904715" target="_blank" class="google-plus"><i class="icon-social-google"></i></a></li>
                    <li><a href="https://www.instagram.com/__ashraful/" target="_blank" class="instagram"><i class="icon-social-instagram"></i></a></li>
                </ul>
            </div>

            <div class="col-md-12 uipasta-credit">
                <p>Thanks to, <a href="http://www.uipasta.com" target="_blank" title="UiPasta">UiPasta</a> for designing.</p>
            </div>

        </div>
    </div>
</footer>
<!-- Footer End -->


<!-- Back to Top Start -->
<a href="#" class="scroll-to-top"><i class="icon-arrow-up-circle"></i></a>
<!-- Back to Top End -->


<!-- All Javascript Plugins  -->
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/plugin.js"></script>

<!-- Main Javascript File  -->
<script type="text/javascript" src="js/scripts.js"></script>


</body>
</html>