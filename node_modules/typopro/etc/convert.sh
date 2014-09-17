#!/bin/sh
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
##  convert.sh: Convert all fonts into Web and DTP formats
##

#   U+0000..U+007F  Basic Latin                                128
#   U+0080..U+00FF  Latin-1 Supplement                         128
#   U+0100..U+017F  Latin Extended-A                           128
#   U+0180..U+024F  Latin Extended-B                           208
#   U+0250..U+02AF  IPA Extensions                              96
#   U+02B0..U+02FF  Spacing Modifier Letters                    80
#   U+0300..U+036F  Combining Diacritical Marks                112
#   --------------
#   U+1DC0..U+1DFF  Combining Diacritical Marks Supplement      64
#   U+1E00..U+1EFF  Latin Extended Additional                  256
#   --------------
#   U+2000..U+206F  General Punctuation                        112
#   U+2070..U+209F  Superscripts and Subscripts                 48
#   U+20A0..U+20CF  Currency Symbols                            48
#   U+20D0..U+20FF  Combining Diacritical Marks for Symbols     48
#   --------------
#   U+2150..U+218F  Number Forms                                64
#   --------------
#   U+2C60..U+2C7F  Latin Extended-C                            32
#   --------------
#   U+A720..U+A7FF  Latin Extended-D                           224

#   argument
pattern="$1"
if [ ".$pattern" = . ]; then
    pattern=".*"

    #   start with fresh output areas
    rm -rf web dtp
    mkdir web dtp
fi

#   configuration
prefix="TypoPRO"

#   sanity check execution
if [ ! -f etc/manifest.txt ]; then
    echo "ERROR: has to be called from top-level" 1>&2
    exit 1
fi

#   iterate over all fonts
OIFS="$IFS"; IFS="
"
for line in `cat etc/manifest.txt | egrep "$pattern"`; do
    IFS="$OIFS"

    #   parse font information
    font=`echo "$line" | sed -e 's; .*$;;'`
    family=`echo "$line" | sed -e 's;.*family="\([^"]*\)".*;\1;'`
    weight=`echo "$line" | sed -e 's;^;X;' -e 's;^X.*weight="\([^"]*\)".*;\1;' -e 's;^X.*;;'`
    style=`echo "$line" | sed -e 's;^;X;' -e 's;^X.*style="\([^"]*\)".*;\1;' -e 's;^X.*;;'`
    stretch=`echo "$line" | sed -e 's;^;X;' -e 's;^X.*stretch="\([^"]*\)".*;\1;' -e 's;^X.*;;'`
    variant=`echo "$line" | sed -e 's;^;X;' -e 's;^X.*variant="\([^"]*\)".*;\1;' -e 's;^X.*;;'`
    noautohint=`echo "$line" | sed -e 's;^;X;' -e 's;^X.*noautohint="\([^"]*\)".*;\1;' -e 's;^X.*;;'`
    name=`echo "$font" | sed -e 's;/.*;;'`
    echo "++ converting: $font ($family)"

    #   create font-specific target area
    if [ ! -d "web/$prefix-$name" ]; then
        mkdir web/$prefix-$name
    fi
    if [ ! -d "dtp/$prefix-$name" ]; then
        mkdir dtp/$prefix-$name
    fi

    #   determine font conversion command (common part)
    cmd="fontface"
    cmd="$cmd -l"
    if [ ".$noautohint" != .yes ]; then
        cmd="$cmd -h"
    fi
    cmd="$cmd -p \"$prefix\""
    cmd="$cmd -f \"$family\""
    if [ ".$weight" != . ]; then
        cmd="$cmd -W \"$weight\""
    fi
    if [ ".$style" != . ]; then
        cmd="$cmd -Y \"$style\""
    fi
    if [ ".$stretch" != . ]; then
        cmd="$cmd -S \"$stretch\""
    fi
    if [ ".$variant" != . ]; then
        cmd="$cmd -V \"$variant\""
    fi

    #   determine font conversion command (Web formats)
    cmd1="$cmd -u '0000-00FF'"
    cmd1="$cmd1 -O \"eot,ttf,woff,css\""
    cmd1="$cmd1 -o \"web/$prefix-$name/\""
    cmd1="$cmd1 \"src/$font\""

    #   determine font conversion command (DTP formats)
    cmd2="$cmd -u '0000-036F,1DC0-1EFF,2000-20FF,2150-218F,2C60-2C7F,A720-A7FF'"
    cmd2="$cmd2 -O \"ttf\""
    cmd2="$cmd2 -o \"dtp/$prefix-$name/\""
    cmd2="$cmd2 \"src/$font\""

    #   execute the font conversion commands
    eval $cmd1
    eval $cmd2
done
IFS="$OIFS"

#   aggregate the CSS files
for font in web/*; do
    name=`echo "$font" | sed -e 's;web/;;'`
    rm -f web/$name/$name.css
    cat web/$name/*.css >tmp.css
    mv tmp.css web/$name/$name.css
done

#   provide font information
for dir in src/*; do
    if [ ! -d $dir ]; then
        continue
    fi
    name=`echo "$dir" | sed -e 's;src/;;'`
    (   cat src/$name/blurb.txt
        echo ""
        cat src/$name/license.txt
    ) >web/$prefix-$name/$prefix-$name.txt
    (   cat src/$name/blurb.txt
        echo ""
        cat src/$name/license.txt
    ) >dtp/$prefix-$name/$prefix-$name.txt
done

