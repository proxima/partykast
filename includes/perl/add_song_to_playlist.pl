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

my $playlist_id = $in{'playlist_id'};
my $video_id = $in{'video_id'};
my $devkey = $in{'devkey'};
my $token = $in{'authtoken'};

my $url = "http://gdata.youtube.com/feeds/api/playlists/" . $playlist_id;
my $browser = LWP::UserAgent->new;

my $data = '<?xml version="1.0" encoding="UTF-8"?><entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><id>' . $video_id . '</id></entry>';
my $datalen = length($data);

my @headers = (
  'Content-Type' => 'application/atom+xml',
  'Content-Length' => '' .$datalen,
  'Authorization' => 'AuthSub token="' . $token . '"',
  'X-GData-Key' => 'key=' . $devkey,
  'GData-Version' => '2',
  'Content' => '' .$data
);

my $response = $browser->post($url, @headers);

print "Content-type: text/plain\n\n";
print $response->content;
