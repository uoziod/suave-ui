#!/usr/bin/env perl
##
##  TypoPRO - Fonts for Professional Typography
##  Copyright (c) 2013-2014 Ralf S. Engelschall <rse@engelschall.com>
##
##  Permission is hereby granted, free of charge, to any person obtaining
##  a copy of this software and associated documentation files (the
##  "Software"), to deal in the Software without restriction, including
##  without limitation the rights to use, copy, modify, merge, publish,
##  distribute, sublicense, and/or sell copies of the Software, and to
##  permit persons to whom the Software is furnished to do so, subject to
##  the following conditions:
##
##  The above copyright notice and this permission notice shall be included
##  in all copies or substantial portions of the Software.
##
##  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
##  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
##  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
##  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
##  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
##  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
##  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
##

##
##  Generate a JavaScript version of the TypoPRO manifest
##

use IO::All;
my $fonts = {};
my $json = "TypoPRO_Manifest = [\n";
my $txt < io("etc/manifest.txt");
foreach my $line (split(/\n/, $txt)) {
    my ($css) = ($line =~ m/^(.+?)\.(?:otf|ttf).*/);
    $css =~ s/^(.*)\/(.*)/web\/TypoPRO-$1\/TypoPRO-$2.css/s;
    my $txt < io($css);
    my ($font_name)    = ($txt =~ m/\/\*\s+(.+?)\s+\*\//s);
    my ($font_family)  = ($txt =~ m/font-family:\s+'([^']+)'/s);
    my ($font_style)   = ($txt =~ m/font-style:\s+(.+?);/s);
    my ($font_weight)  = ($txt =~ m/font-weight:\s+(.+?);/s);
    my ($font_stretch) = ($txt =~ m/font-stretch:\s+(.+?);/s);
    my ($font_variant) = ($txt =~ m/font-variant:\s+(.+?);/s);
    $json .= "    { " .
        "\"name\": \"$font_name\", " .
        "\"family\": \"$font_family\", " .
        "\"style\": \"$font_style\", " .
        "\"weight\": \"$font_weight\", " .
        "\"stretch\": \"$font_stretch\", " .
        "\"variant\": \"$font_variant\", " .
        "\"css\": \"$css\" " .
    "},\n";
}
$json =~ s/,\n$/\n/s;
$json .= "];\n";
$json > io("etc/manifest.js");

