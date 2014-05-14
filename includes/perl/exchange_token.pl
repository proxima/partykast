#!/usr/bin/perl

use strict;
use warnings;

use CGI;

my $cgi = new CGI;
my $query_string = $cgi->query_string;

my %in;

if (length ($query_string) > 0) {
     my $buffer = $query_string;
     my @pairs = split(/;/, $buffer);     
     foreach my $pair (@pairs){
          (my $name, my $value) = split(/=/, $pair);
          $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;
          $in{$name} = $value;
     }
}

use LWP 5.64;

my $url = "https://www.google.com/accounts/AuthSubSessionToken";
my $browser = LWP::UserAgent->new;

my $token = $in{'authtoken'};

my @headers = (
  'Authorization' => 'AuthSub token="' . $token . '"'
);

my $response = $browser->get($url, @headers);

print "Content-type: text/plain\n\n";
print $response->content;
