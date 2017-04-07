<?php
$testimonials = [
    [
        'name' => 'Phil Guegan',
        'title' => 'CEO & Founder - Infogems',
        'speech' => _('Excellent freelancer and very easy to work with. Great knowledge of Yii/PHP, excellent English and very good communicator, and very reliable.'),
    ],
    [
        'name' => 'webtechriders',
        'title' => '',
        'speech' => _('Ferenc is the best contractor that I met ever on Elance. He is highly talented, professional and hard worker. He did the task exactly I ask him to do. Ferenc completed the task and made sure I was completely satisfied. He was very responsive to questions and concerns. I will indeed be a repeat customer as I am very pleased with my website!'),
    ],
    [
        'name' => 'DanD',
        'title' => '',
        'speech' => _('Ferenc is a very talented PHP developer. He quickly got to grips with what was required and delivered everything (and more) that I expected of him. I would happily work with him again.'),
    ],
    [
        'name' => 'kall52',
        'title' => '',
        'speech' => _('I would most definitely re-hire pappfer and I highly recommend his services.'),
    ],
];
?>
<!DOCTYPE html>
<html lang="en" class="theme-color-07cb79 theme-skin-light">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?= _('Freelancer PHP/Yii2/JavaScript developer') ?></title>

    <!-- Favicon -->
    <link rel="shortcut icon" type="image/ico" href="img/favicon.png"/>

    <!-- Google Fonts -->
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Fredoka+One">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic">

    <!-- Icon Fonts -->
    <link rel="stylesheet" type="text/css" href="fonts/map-icons/css/map-icons.min.css">
    <link rel="stylesheet" type="text/css" href="fonts/icomoon/style.css">

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="js/plugins/jquery.bxslider/jquery.bxslider.css">
    <link rel="stylesheet" type="text/css" href="js/plugins/jquery.customscroll/jquery.mCustomScrollbar.min.css">
    <link rel="stylesheet" type="text/css" href="js/plugins/jquery.mediaelement/mediaelementplayer.min.css">
    <link rel="stylesheet" type="text/css" href="js/plugins/jquery.fancybox/jquery.fancybox.css">
    <link rel="stylesheet" type="text/css" href="js/plugins/jquery.owlcarousel/owl.carousel.css">
    <link rel="stylesheet" type="text/css" href="js/plugins/jquery.owlcarousel/owl.theme.css">
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" type="text/css" href="colors/green.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Modernizer for detect what features the user’s browser has to offer -->
    <script type="text/javascript" src="js/libs/modernizr.js"></script>
</head>

<body class="home header-has-img loading">

    <div class="mobile-nav">
        <button class="btn-mobile mobile-nav-close"><i class="rsicon rsicon-close"></i></button>

        <div class="mobile-nav-inner">
            <nav id="mobile-nav" class="nav">
                <ul class="clearfix">
                    <li><a href="#about"><?= _('About') ?></a></li>
                    <li><a href="#skills"><?= _('Skills') ?></a></li>
                    <li><a href="#portfolio"><?= _('Portfolio') ?></a></li>
                    <li><a href="#experience"><?= _('Experience') ?></a></li>
                    <li><a href="#references"><?= _('References') ?></a></li>
                    <li><a href="#contact"><?= _('Contact') ?></a></li>
                </ul>
            </nav>
        </div>
    </div>
    <!-- .mobile-nav -->

    <div class="sidebar sidebar-fixed">
        <button class="btn-sidebar btn-sidebar-close"><i class="rsicon rsicon-close"></i></button>

        <div class="widget-area">
            <aside class="widget widget-profile">
                <div class="profile-photo">
                    <img src="img/uploads/pappfer.jpg" alt="<?= _('Ferenc Papp') ?>">
                </div>
                <div class="profile-info">
                    <h2 class="profile-title"><?= _('Ferenc Papp') ?></h2>

                    <h3 class="profile-position"><?= _('Full stack web developer') ?></h3>
                </div>
            </aside>
            <!-- .widget-profile -->

            <aside class="widget widget_search">
                <h2 class="widget-title"><?= _('Search') ?></h2>

                <form class="search-form">
                    <label class="ripple">
                        <span class="screen-reader-text"><?= _('Search for:') ?></span>
                        <input class="search-field" type="search" placeholder="<?= _('Search') ?>">
                    </label>
                    <input type="submit" class="search-submit" value="<?= _('Search') ?>">
                </form>
            </aside>
            <!-- .widget_search -->

            <aside class="widget widget_contact">
                <h2 class="widget-title"><?= _('Contact me') ?></h2>

                <form class="rsForm" action="php/mailsender.php" method="post">
                    <div class="input-field">
                        <label><?= _('Name') ?></label>
                        <input type="text" name="rsName" value="">
                        <span class="line"></span>
                    </div>

                    <div class="input-field">
                        <label><?= _('Email') ?></label>
                        <input type="email" name="rsEmail" value="">
                        <span class="line"></span>
                    </div>

                    <div class="input-field">
                        <label><?= _('Subject') ?></label>
                        <input type="text" name="rsSubject" value="">
                        <span class="line"></span>
                    </div>

                    <div class="input-field">
                        <label><?= _('Message') ?></label>
                        <textarea rows="4" name="rsMessage"></textarea>
                        <span class="line"></span>
                    </div>

                    <span class="btn-outer btn-primary-outer ripple">
                        <input class="rsFormSubmit btn btn-lg btn-primary" type="submit" value="<?= _('Send') ?>">
                    </span>
                </form>
            </aside>
            <!-- .widget_contact -->
        </div>
        <!-- .widget-area -->
    </div>
    <!-- .sidebar -->

    <div class="wrapper">
        <header class="header">
            <div class="head-bg" style="background-image: url('img/uploads/cover.jpeg')"></div>

            <div class="head-bar">
                <div class="head-bar-inner">
                    <div class="row">
                        <div class="col-sm-3 col-xs-6">
                            <a class="logo" href="index.php"><span>RS</span>card</a>
                            <!-- <a class="head-logo" href=""><img src="img/rs-logo.png" alt="RScard"/></a> -->
                        </div>

                        <div class="col-sm-9 col-xs-6">
                            <div class="nav-wrap">
                                <nav id="nav" class="nav">
                                    <ul class="clearfix">
                                        <li><a href="#about"><?= _('About') ?></a></li>
                                        <li><a href="#skills"><?= _('Skills') ?></a></li>
                                        <li><a href="#portfolio"><?= _('Portfolio') ?></a></li>
                                        <li><a href="#experience"><?= _('Experience') ?></a></li>
                                        <li><a href="#references"><?= _('References') ?></a></li>
                                        <li><a href="#contact"><?= _('Contact') ?></a></li>
                                    </ul>
                                </nav>

                                <button class="btn-mobile btn-mobile-nav"><?= _('Menu') ?></button>
                                <button class="btn-sidebar btn-sidebar-open"><i class="rsicon rsicon-menu"></i></button>
                            </div>
                            <!-- .nav-wrap -->
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- .header -->

        <div class="content">
            <div class="container">

            <!-- START: PAGE CONTENT -->
            <section id="about" class="section section-about">
                <div class="animate-up">
                    <div class="section-box">
                        <div class="profile">
                            <div class="row">
                                <div class="col-xs-5">
                                    <div class="profile-photo"><img src="img/uploads/pappfer.jpg" alt="<?= _('Ferenc Papp') ?>"/></div>
                                </div>
                                <div class="col-xs-7">
                                    <div class="profile-info">
                                        <div class="profile-preword"><span><?= _('Hello') ?></span></div>
                                        <h1 class="profile-title"><?= _('<span>I\'m</span> Ferenc Papp') ?></h1>

                                        <h2 class="profile-position"><?= _('Full stack web developer') ?></h2></div>
                                    <ul class="profile-list">
                                        <li class="clearfix">
                                            <strong class="title"><?= _('Age') ?></strong>
                                            <span class="cont">31</span>
                                        </li>
                                        <li class="clearfix">
                                            <strong class="title"><?= _('Address') ?></strong>
                                            <span class="cont"><?= _('Debrecen, Hungary, 4032') ?></span>
                                        </li>
                                        <li class="clearfix">
                                            <strong class="title"><?= _('Email') ?></strong>
                                            <span class="cont"><a href="mailto:pappfer@pappfer.hu">pappfer@pappfer.hu</a></span>
                                        </li>
                                        <li class="clearfix">
                                            <strong class="title">LinkedIn</strong>
                                            <span class="cont"><a href="https://www.linkedin.com/in/pappfer">linkedin.com/in/pappfer</a></span>
                                        </li>
                                        <li class="clearfix">
                                            <strong class="title"><span class="button" style="background: #d9534f"><?= _('Currently unavailable for new projects') ?></span></strong>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="profile-social">
                            <ul class="social">
                                <li><a class="ripple-centered" href="https://twitter.com/pappfer" target="_blank"><i
                                        class="rsicon rsicon-twitter"></i></a></li>
                                <li><a class="ripple-centered" href="https://www.linkedin.com/in/pappfer" target="_blank"><i
                                        class="rsicon rsicon-linkedin"></i></a></li>
                                <li><a class="ripple-centered" href="https://github.com/pappfer" target="_blank"><i
                                        class="rsicon rsicon-github"></i></a></li>
                                <li><a class="ripple-centered" href="http://stackoverflow.com/users/3736962/pappfer" target="_blank"><i
                                        class="rsicon rsicon-stack-overflow"></i></a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="section-txt-btn">
                        <p><a class="btn btn-lg btn-border ripple" target="_blank"
                              href="http://dev.novembit.com/rs_card/wp-content/uploads/2015/11/test-1.pdf"><?= _('Download Resume') ?></a></p>

                        <p><?= _("I'm a professional PHP developer with 10 years of experience. Prefer to use Yii framework.
                            I also enjoy building front-end where I'm using responsive design and continuously following the newest technologies and trends. I'm running my own websites on a VPS what I manage so I have some experience with Linux servers along with Apache and Nginx web servers.
                            I also develop Wordpress plugins, platform independent mobile apps and I'm good at SEO.
                            I'm a good team-player and have experience in using Git/SVN.") ?></p>
                    </div>
                </div>
            </section>
            <!-- #about -->

            <section id="skills" class="section section-skills">
                <div class="animate-up">
                    <h2 class="section-title"><?= _('Professional Skills') ?></h2>

                    <div class="section-box">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">PHP & MySQL</span>
                                        <span class="bar-value">89%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="89%"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">Yii2 framework</span>
                                        <span class="bar-value">85%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="85%"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">JavaScript</span>
                                        <span class="bar-value">80%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="80%"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">HTML & CSS</span>
                                        <span class="bar-value">89%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="89%"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">Wordpress</span>
                                        <span class="bar-value">75%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="75%"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">Phonegap / Cordova</span>
                                        <span class="bar-value">70%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="70%"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">React, Vue.js, AngularJS</span>
                                        <span class="bar-value">70%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="70%"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="progress-bar">
                                    <div class="bar-data">
                                        <span class="bar-title">React Native, Ionic Framework</span>
                                        <span class="bar-value">60%</span>
                                    </div>
                                    <div class="bar-line">
                                        <span class="bar-fill" data-width="60%"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- #skills -->

            <section id="portfolio" class="section section-portfolio">
            <div class="animate-up">
            <h2 class="section-title"><?= _('Portfolio') ?></h2>

            <div class="filter">
                <div class="filter-inner">
                    <div class="filter-btn-group">
                        <button data-filter="*"><?= _('All') ?></button>
                        <button data-filter=".photography"><?= _('Own websites') ?></button>
                        <button data-filter=".nature"><?= _('Company') ?></button>
                    </div>
                    <div class="filter-bar">
                        <span class="filter-bar-line"></span>
                    </div>
                </div>
            </div>

            <div class="grid">
                <div class="grid-sizer"></div>

                <div class="grid-item size22 photography">
                    <div class="grid-box">
                        <figure class="portfolio-figure">
                            <img src="img/uploads/portfolio/portfolio-thumb-05-610x600.jpg" alt=""/>
                            <figcaption class="portfolio-caption">
                                <div class="portfolio-caption-inner">
                                    <h3 class="portfolio-title">Street Photography</h3>
                                    <h4 class="portfolio-cat">Photography</h4>

                                    <div class="btn-group">
                                        <a class="btn-link" href="http://bit.ly/1YtB8he" target="_blank"><i
                                                class="rsicon rsicon-link"></i></a>
                                        <a class="portfolioFancybox btn-zoom" data-fancybox-group="portfolioFancybox1"
                                           href="#portfolio1-inline1"><i class="rsicon rsicon-eye"></i></a>
                                        <a class="portfolioFancybox hidden" data-fancybox-group="portfolioFancybox1"
                                           href="#portfolio1-inline2"></a>
                                        <a class="portfolioFancybox hidden" data-fancybox-group="portfolioFancybox1"
                                           href="#portfolio1-inline3"></a>
                                    </div>
                                </div>
                            </figcaption>
                        </figure>

                        <!-- Start: Portfolio Inline Boxes -->
                        <div id="portfolio1-inline1" class="fancybox-inline-box">
                            <div class="inline-embed" data-embed-type="image"
                                 data-embed-url="img/uploads/portfolio/portfolio-thumb-05-large.jpg"></div>
                            <div class="inline-cont">
                                <h2 class="inline-title">Street photography is photography that features the chance
                                    encounters and random accidents within public places.</h2>

                                <div class="inline-text">
                                    <p>Street photography does not necessitate the presence of a street or even the urban
                                        environment. Though people usually feature directly, street photography might be
                                        absent of people and can be an object or environment where the image projects a
                                        decidedly human character in facsimile or aesthetic.</p>
                                </div>
                            </div>
                        </div>

                        <div id="portfolio1-inline2" class="fancybox-inline-box">
                            <div class="inline-embed" data-embed-type="image"
                                 data-embed-url="img/uploads/portfolio/portfolio-thumb-01-large.jpg"></div>
                            <div class="inline-cont">
                                <div class="inline-text">
                                    <h2 class="inline-title">Framing and timing</h2>

                                    <p>Framing and timing can be key aspects of the craft with the aim of some street
                                        photography being to create images at a decisive or poignant moment. Street
                                        photography can focus on emotions displayed, thereby also recording people's history
                                        from an emotional point of view.</p>
                                </div>
                            </div>
                        </div>

                        <div id="portfolio1-inline3" class="fancybox-inline-box">
                            <div class="inline-embed" data-embed-type="iframe"
                                 data-embed-url="https://player.vimeo.com/video/118244244"></div>
                            <div class="inline-cont">
                                <div class="inline-text">
                                    <h2 class="inline-title">A Look Into Documenting Street Fashion Photography</h2>

                                    <p>HB Nam is an internationally known street fashion photographer. In this Leica Camera
                                        Portrait, Nam explains how he started in photography and what photography means to
                                        him. For Nam, it's about documenting what's around him and the concentration
                                        required to achieve a good shot.</p>
                                </div>
                            </div>
                        </div>
                        <!-- End: Portfolio Inline Boxes -->
                    </div>
                </div>
                <!-- .grid-item -->

                <div class="grid-item size11 bridge">
                    <div class="grid-box">
                        <figure class="portfolio-figure">
                            <img src="img/uploads/portfolio/portfolio-thumb-11-289x281.jpg" alt=""/>
                            <figcaption class="portfolio-caption">
                                <div class="portfolio-caption-inner">
                                    <h3 class="portfolio-title">Suspension Bridge</h3>
                                    <h4 class="portfolio-cat">Bridge</h4>

                                    <div class="btn-group">
                                        <a class="btn-link" href="http://bit.ly/1YtB8he" target="_blank"><i
                                                class="rsicon rsicon-link"></i></a>
                                        <a class="portfolioFancybox btn-zoom" data-fancybox-group="portfolioFancybox2"
                                           href="#portfolio2-inline1"><i class="rsicon rsicon-eye"></i></a>
                                    </div>
                                </div>
                            </figcaption>
                        </figure>

                        <!-- Start: Portfolio Inline Boxes -->
                        <div id="portfolio2-inline1" class="fancybox-inline-box">
                            <div class="inline-cont">
                                <h2 class="inline-title">Suspension Bridges - Design Technology</h2>

                                <div class="inline-text">
                                    <p>Suspension bridges in their simplest form were originally made from rope and wood.
                                        Modern suspension bridges use a box section roadway supported by high tensile
                                        strength cables.
                                        In the early nineteenth century, suspension bridges used iron chains for cables. The
                                        high tensile cables used in most modern suspension
                                        bridges were introduced in the late nineteenth century.<br/>
                                        Today, the cables are made of thousands of individual steel wires bound tightly
                                        together. Steel, which is very strong under tension, is
                                        an ideal material for cables; a single steel wire, only 0.1 inch thick, can support
                                        over half a ton without breaking.</p>

                                    <p>Light, and strong, suspension bridges can span distances from 2,000 to 7,000 feet far
                                        longer than any other kind of bridge. They are
                                        ideal for covering busy waterways.</p>

                                    <p>With any bridge project the choice of materials and form usually comes down to cost.
                                        Suspension bridges tend to be the most expensive to build. A suspension bridge
                                        suspends the roadway from huge main cables, which extend
                                        from one end of the bridge to the other. These cables rest on top of high towers and
                                        have to be securely anchored into the bank at either
                                        end of the bridge. The towers enable the main cables to be draped over long
                                        distances. Most of the weight or load of the bridge is
                                        transferred by the cables to the anchorage systems. These are imbedded in either
                                        solid rock or huge concrete blocks. Inside the anchorages,
                                        the cables are spread over a large area to evenly distribute the load and to prevent
                                        the cables from breaking free.</p>

                                    <p>The Arthashastra of Kautilya mentions the construction of dams and bridges.A Mauryan
                                        bridge near Girnar was surveyed by James Princep.
                                        The bridge was swept away during a flood, and later repaired by Puspagupta, the
                                        chief architect of emperor Chandragupta I. The bridge
                                        also fell under the care of the Yavana Tushaspa, and the Satrap Rudra Daman. The use
                                        of stronger bridges using plaited bamboo and iron
                                        chain was visible in India by about the 4th century. A number of bridges, both for
                                        military and commercial purposes, were constructed by
                                        the Mughal administration in India.</p>
                                </div>
                            </div>
                        </div>
                        <!-- End: Portfolio Inline Boxes -->
                    </div>
                </div>
                <!-- .grid-item -->

                <div class="grid-item size11 nature photography">
                    <div class="grid-box">
                        <figure class="portfolio-figure">
                            <img src="img/uploads/portfolio/portfolio-thumb-08-289x281.jpg" alt=""/>
                            <figcaption class="portfolio-caption">
                                <div class="portfolio-caption-inner">
                                    <h3 class="portfolio-title">Rocky Mountains</h3>
                                    <h4 class="portfolio-cat">Nature, Photography</h4>

                                    <div class="btn-group">
                                        <a class="btn-link" href="http://bit.ly/1YtB8he" target="_blank"><i
                                                class="rsicon rsicon-link"></i></a>
                                        <a class="portfolioFancybox btn-zoom" data-fancybox-group="portfolioFancybox3"
                                           href="#portfolio3-inline1"><i class="rsicon rsicon-eye"></i></a>
                                        <a class="portfolioFancybox hidden" data-fancybox-group="portfolioFancybox3"
                                           href="#portfolio3-inline2"></a>
                                        <a class="portfolioFancybox hidden" data-fancybox-group="portfolioFancybox3"
                                           href="#portfolio3-inline3"></a>
                                    </div>
                                </div>
                            </figcaption>
                        </figure>

                        <!-- Start: Portfolio Inline Boxes -->
                        <div id="portfolio3-inline1" class="fancybox-inline-box">
                            <div class="inline-embed" data-embed-type="image"
                                 data-embed-url="img/uploads/portfolio/portfolio-thumb-08-large.jpg"></div>
                        </div>

                        <div id="portfolio3-inline2" class="fancybox-inline-box">
                            <div class="inline-embed" data-embed-type="image"
                                 data-embed-url="img/uploads/portfolio/portfolio-thumb-04-large.jpg"></div>
                        </div>

                        <div id="portfolio3-inline3" class="fancybox-inline-box">
                            <div class="inline-embed" data-embed-type="image"
                                 data-embed-url="img/uploads/portfolio/portfolio-thumb-02-large.jpg"></div>
                        </div>
                        <!-- End: Portfolio Inline Boxes -->
                    </div>
                </div>
                <!-- .grid-item -->
            </div>

            <div class="grid-more">
                <span class="ajax-loader"></span>
                <button class="btn btn-border ripple"><i class="rsicon rsicon-add"></i></button>
            </div>
            </div>
            </section>
            <!-- #portfolio -->

            <section id="experience" class="section section-experience">
                <div class="animate-up">
                    <h2 class="section-title"><?= _('Work Experience') ?></h2>

                    <div class="timeline">
                        <div class="timeline-bar"></div>
                        <div class="timeline-inner clearfix">
                            <div class="timeline-box timeline-box-right">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-left">
                                    <span class="arrow"></span>

                                    <div class="date">2017 - <?= _('present') ?></div>
                                    <h3><?= _('Contractor') ?></h3>
                                    <h4><?= _('Full stack web developer') ?></h4>

                                    <p><?= _('I am currently an entrepreneur working as a full stack web developer.') ?></p>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-left">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-right">
                                    <span class="arrow"></span>

                                    <div class="date">2014 - 2017</div>
                                    <h3>Fathom Minds</h3>
                                    <h4><?= _('Senior PHP developer') ?></h4>

                                    <p><?= _('Currently working at Fathom Minds as a senior developer. I mainly use Yii2 framework 
                                    for developing websites, web APIs but I also had the chance to set up the company\'s Git environment
                                    and work on our own Flow project.') ?></p>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-right">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-left">
                                    <span class="arrow"></span>

                                    <div class="date">2014 - 2015</div>
                                    <h3><?= _('Oktafone') ?></h3>
                                    <h4><?= _('Frontend developer') ?></h4>

                                    <p><?= _('I was working on a web application for a startup company. I used AngularJS, 
                                    JavaScript, HTML5 and CSS3 technologies.') ?></p>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-left">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-right">
                                    <span class="arrow"></span>

                                    <div class="date">2012 - 2014</div>
                                    <h3>pappfer.hu</h3>
                                    <h4><?= _('Freelancer PHP developer') ?></h4>

                                    <p><?= _('I developed websites for both individuals and companies. I get most of my work 
                                    through freelancer websites. I prefer to use Yii framework for new projects but I also 
                                    had to use plain PHP or other frameworks. Used technologies:') ?></p>
                                    <ul>
                                        <li>PHP, Yii framework, Wordpress</li>
                                        <li>HTML5, CSS3, JavaScript, jQuery, AngularJS</li>
                                        <li>Twitter Bootstrap, Zurb Foundation</li>
                                        <li>Facebook, LinkedIn, Box.com, Stripe integration</li>
                                        <li>Yii console application (scheduled e-mails with cronjob)</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-right">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-left">
                                    <span class="arrow"></span>

                                    <div class="date">2011 - 2012</div>
                                    <h3>British Telecom</h3>
                                    <h4><?= _('Network administrator') ?></h4>

                                    <p><?= _('I was configuring network tools such as routers, switches. We supported many 
                                    networks all over the world. I spoke English with customers all over the world and also 
                                    achieved soft skill certificates.') ?></p>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-left">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-right">
                                    <span class="arrow"></span>

                                    <div class="date">2010 - 2011</div>
                                    <h3>IT Services</h3>
                                    <h4><?= _('System administrator') ?></h4>

                                    <p><?= _('I was maintaining Linux and Windows servers and I was also administering 
                                    Avaya IP phones. During my working hours I had a possibility to develop PHP application 
                                    as well. With one of my mates we created a PHP script which automated many monotonous task. 
                                    With the result of this we saved about 3 hours a day for all of my colleagues. 
                                    Later I got great recognition for this job. Apart from this we also created a 
                                    Greasemonkey script to make our colleagues life easier.') ?></p>
                                    <ul>
                                        <li><?= _('IT Services innovation award for the PHP script what me and my mate has created') ?></li>
                                        <li><?= _('Learning German (basic level)') ?></li>
                                        <li><?= _('Soft skill certificates') ?></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-right">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-left">
                                    <span class="arrow"></span>

                                    <div class="date">2009 - 2010</div>
                                    <h3>Concept Solutions</h3>
                                    <h4><?= _('PHP developer') ?></h4>

                                    <p><?= _('I was doing remote work. We used PHP. Most of the times I had to continue 
                                    or fix someone else’s code so I had a chance to see many different source code and 
                                    I gained lots of experience.') ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- #experience -->

            <section id="education" class="section section-education">
                <div class="animate-up">
                    <h2 class="section-title"><?= _('Education & Charity') ?></h2>

                    <div class="timeline">
                        <div class="timeline-bar"></div>
                        <div class="timeline-inner clearfix">

                            <div class="timeline-box timeline-box-compact timeline-box-left">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-right">
                                    <span class="arrow"></span>

                                    <div class="date"><span>2005 - <?= _('(unfinished)') ?></span></div>
                                    <h3><?= _('Software Engineering') ?></h3>
                                    <h4><?= _('University of Debrecen') ?></h4>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-compact timeline-box-left">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-right">
                                    <span class="arrow"></span>

                                    <div class="date"><span>2014 - 2015</span></div>
                                    <h3><?= _('Worked in a charity shop in Edinburgh, Scotland') ?></h3>
                                    <h4>Bethany Christian Trust</h4>
                                </div>
                            </div>

                            <div class="timeline-box timeline-box-compact timeline-box-right">
                                <span class="dot"></span>

                                <div class="timeline-box-inner animate-left">
                                    <span class="arrow"></span>

                                    <div class="date"><span>2000 - 2014</span></div>
                                    <h3><?= _('IT specialist') ?></h3>
                                    <h4><?= _('Reformed College of Debrecen') ?></h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <!-- #education -->

            <section id="clients" class="section section-clients">
                <div class="animate-up">

                    <div class="clients-carousel">
                        <div class="client-logo">
                            <a href="http://market.envato.com" target="_blank"><img src="img/uploads/logos/logo-envato.png"
                                                                                    title="envato" alt="envato"/></a>
                        </div>

                        <div class="client-logo">
                            <img src="img/uploads/logos/logo-angularjs.png" title="angular js" alt="angular js"/>
                        </div>

                        <div class="client-logo">
                            <a href="https://www.omniref.com/ruby/gems/teaspoon/0.7.9" target="_blank"><img
                                    src="img/uploads/logos/logo-teaspoon.png" title="teaspoon" alt="teaspoon"/></a>
                        </div>

                        <div class="client-logo">
                            <a href="https://wordpress.com" target="_blank"><img src="img/uploads/logos/logo-wordpress.png"
                                                                                 title="wordpress" alt="wordpress"/></a>
                        </div>

                        <div class="client-logo">
                            <a href="https://evernote.com" target="_blank"><img src="img/uploads/logos/logo-evernote.png"
                                                                                title="evernote" alt="evernote"/></a>
                        </div>

                        <div class="client-logo">
                            <a href="http://compass-style.org" target="_blank"><img src="img/uploads/logos/logo-compass.png"
                                                                                    title="compass" alt="compass"/></a>
                        </div>

                        <div class="client-logo">
                            <a href="http://getbootstrap.com" target="_blank"><img src="img/uploads/logos/logo-bootstrap.png"
                                                                                   title="bootstrap" alt="bootstrap"/></a>
                        </div>

                        <div class="client-logo">
                            <a href="http://jasmine.github.io" target="_blank"><img src="img/uploads/logos/logo-jasmine.png"
                                                                                    title="jasmine" alt="jasmine"/></a>
                        </div>

                        <div class="client-logo">
                            <a href="https://jquery.com" target="_blank"><img src="img/uploads/logos/logo-jquery.png" title="jquery"
                                                                              alt="jquery"/></a>
                        </div>
                    </div>
                </div>
            </section>
            <!-- #clients -->

            <section id="references" class="section section-references">
                <div class="animate-up">
                    <h2 class="section-title">References</h2>

                    <div class="section-box">
                        <ul class="ref-slider">
                            <?php foreach ($testimonials as $testimonial) : ?>
                            <li>
                                <div class="ref-box">
                                    <div class="person-speech">
                                        <p><?= $testimonial['speech'] ?></p>
                                    </div>
                                    <div class="person-info clearfix">
                                        <img class="person-img" src="img/uploads/rs-avatar-60x60.jpg" alt="Headshot">

                                        <div class="person-name-title">
                                            <span class="person-name"><?= $testimonial['name'] ?></span>
                                            <?php if (!empty($testimonial['title'])) { ?>
                                            <span class="person-title"><?= $testimonial['title'] ?></span>
                                            <?php } ?>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                        <div class="ref-slider-nav">
                            <span id="ref-slider-prev" class="slider-prev"></span>
                            <span id="ref-slider-next" class="slider-next"></span>
                        </div>
                    </div>
                </div>
            </section>
            <!-- #references -->

            <section id="text-section" class="section section-text">
                <div class="animate-up animated">
                    <h2 class="section-title">Text Section</h2>

                    <div class="section-box">
                        <p>Hello! I’m Robert Smith and this is custom editor section. You can add here any text or "Strikethrough"
                            text and even you can add bulleted or numbered text and even you will be able to add blockquot text. You
                            can align this text to left/right/center.

                            One of the most interesting options is to divide this section to "One half" "One Third" and "One
                            Fourth".

                            You can use this for Honors or Achievments or Awards sections. You can insert images and photos right in
                            this editor!</p>
                    </div>
                </div>
            </section>
            <!-- #text-section -->

            <section id="interests" class="section section-interests">
                <div class="animate-up">
                    <h2 class="section-title"><?= _('My Interests') ?></h2>

                    <div class="section-box">
                        <p><?= _('My favourite hobby is playing football but I really like any kind of sports. I like hiking,
                        cycling, swimming, playing squash, table tennis and bowling.') ?></p>

                        <ul class="interests-list">
                            <li>
                                <i class="map-icon map-icon-bicycling"></i>
                                <span><?= ('Bicycling') ?></span>
                            </li>
                            <li>
                                <i class="map-icon map-icon-swimming"></i>
                                <span><?= ('Swimming') ?></span>
                            </li>
                            <li>
                                <i class="map-icon map-icon-horse-riding"></i>
                                <span><?= ('Horse riding') ?></span>
                            </li>
                            <li>
                                <i class="map-icon map-icon-bowling-alley"></i>
                                <span><?= ('Playing Bowling') ?></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!-- #interests -->

            <section id="contact" class="section section-contact">
                <div class="animate-up">
                    <h2 class="section-title"><?= _('Contact Me') ?></h2>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="section-box contact-form">
                                <h3><?= _('Feel free to contact me') ?></h3>

                                <form class="rsForm" action="php/mailsender.php" method="post">
                                    <div class="input-field">
                                        <label><?= _('Name') ?></label>
                                        <input type="text" name="rsName" value="">
                                        <span class="line"></span>
                                    </div>

                                    <div class="input-field">
                                        <label><?= _('Email') ?></label>
                                        <input type="email" name="rsEmail" value="">
                                        <span class="line"></span>
                                    </div>

                                    <div class="input-field">
                                        <label><?= _('Subject') ?></label>
                                        <input type="text" name="rsSubject" value="">
                                        <span class="line"></span>
                                    </div>

                                    <div class="input-field">
                                        <label><?= _('Message') ?></label>
                                        <textarea rows="4" name="rsMessage"></textarea>
                                        <span class="line"></span>
                                    </div>

                                    <span class="btn-outer btn-primary-outer ripple">
                                        <input class="rsFormSubmit btn btn-lg btn-primary" type="submit" value="<?= _('Send') ?>">
                                    </span>
                                </form>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="section-box contact-info has-map">
                                <ul class="contact-list">
                                    <li class="clearfix">
                                        <strong><?= _('Address') ?></strong>
                                        <span>Hungary, Debrecen</span>
                                    </li>
                                    <li class="clearfix">
                                        <strong>LinkedIn</strong>
                                        <span><a href="https://www.linkedin.com/in/pappfer">linkedin.com/in/pappfer</a></span>
                                    </li>
                                    <li class="clearfix">
                                        <strong><?= _('Email') ?></strong>
                                        <span><a href="mailto:pappfer@pappfer.hu">pappfer@pappfer.hu</a></span>
                                    </li>
                                </ul>

                                <div id="map" data-latitude="47.531605" data-longitude="21.627312"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- #contact -->
            <!-- END: PAGE CONTENT -->

        </div>
        <!-- .container -->
    </div>
    <!-- .content -->

    <footer class="footer">
        <div class="footer-social">
            <ul class="social">
                <li><a class="ripple-centered" href="https://twitter.com/pappfer" target="_blank"><i
                            class="rsicon rsicon-twitter"></i></a></li>
                <li><a class="ripple-centered" href="https://www.linkedin.com/in/pappfer" target="_blank"><i
                            class="rsicon rsicon-linkedin"></i></a></li>
                <li><a class="ripple-centered" href="https://github.com/pappfer" target="_blank"><i
                            class="rsicon rsicon-github"></i></a></li>
                <li><a class="ripple-centered" href="http://stackoverflow.com/users/3736962/pappfer" target="_blank"><i
                            class="rsicon rsicon-stack-overflow"></i></a></li>
            </ul>
        </div>
    </footer>
    <!-- .footer -->

    </div>
    <!-- .wrapper -->

    <a class="btn-scroll-top" href="#"><i class="rsicon rsicon-arrow-up"></i></a>

    <div id="overlay"></div>
    <div id="preloader">
        <div class="preload-icon"><span></span><span></span></div>
        <div class="preload-text"><?= ('Loading...') ?></div>
    </div>

    <!-- Scripts -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js"></script>
    <script type="text/javascript" src="fonts/map-icons/js/map-icons.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.mousewheel-3.0.6.pack.js"></script>
    <script type="text/javascript" src="js/plugins/imagesloaded.pkgd.min.js"></script>
    <script type="text/javascript" src="js/plugins/isotope.pkgd.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.appear.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.onepagenav.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.bxslider/jquery.bxslider.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.customscroll/jquery.mCustomScrollbar.concat.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.mediaelement/mediaelement-and-player.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.fancybox/jquery.fancybox.pack.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.fancybox/helpers/jquery.fancybox-media.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.owlcarousel/owl.carousel.min.js"></script>
	<script type="text/javascript" src="js/options.js"></script>
    <script type="text/javascript" src="js/site.min.js"></script>
</body>
</html>