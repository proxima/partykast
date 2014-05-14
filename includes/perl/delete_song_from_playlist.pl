#!/usr/bin/perl

use strict;
use warnings;

use HTTP::Request::Common qw(DELETE);
use HTTP::Message;
use LWP::UserAgent;
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

my $playlist_id = $in{'playlist_id'};
my $update_id = $in{'update_id'};
my $devkey = $in{'devkey'};
my $token = $in{'authtoken'};

my $url = DELETE "http://gdata.youtube.com/feeds/api/playlists/" . $playlist_id . "/" . $update_id;
my $browser = LWP::UserAgent->new;

my @headers = (
  'Content-Type' => 'application/atom+xml',
  'Authorization' => 'AuthSub token="' . $token . '"',
  'X-GData-Key' => 'key=' . $devkey,
  'GData-Version' => '2'
);

my $response = $browser->request($url, @headers);

print "Content-type: text/plain\n\n";
print $response->content;
